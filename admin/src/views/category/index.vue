<template>
  <div class="category-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd()">新增分类</el-button>
        </div>
      </template>

      <el-table
        :data="categoryList"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="slug" label="标识" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort_order" label="排序" width="80" align="center" />
        <el-table-column prop="is_active" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleAdd(row.id)">
              添加子分类
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="标识" prop="slug">
          <el-input v-model="formData.slug" placeholder="留空自动生成" />
        </el-form-item>
        <el-form-item label="父分类" prop="parent_id">
          <el-tree-select
            v-model="formData.parent_id"
            :data="categoryTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择父分类（留空为顶级分类）"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="formData.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getCategoryListApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  type Category,
  type CreateCategoryDto,
} from '@/api/category'

const categoryList = ref<Category[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref<FormInstance>()
const currentId = ref<number>()

const formData = reactive<CreateCategoryDto>({
  name: '',
  slug: '',
  description: '',
  parent_id: undefined,
  sort_order: 0,
  icon: '',
  is_active: true,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

// 构建树形选择器选项（排除当前编辑的分类及其子分类）
const categoryTreeOptions = computed(() => {
  if (!currentId.value) return categoryList.value
  
  const filterCategory = (categories: Category[]): Category[] => {
    return categories
      .filter(cat => cat.id !== currentId.value)
      .map(cat => ({
        ...cat,
        children: cat.children ? filterCategory(cat.children) : undefined,
      }))
  }
  
  return filterCategory(categoryList.value)
})

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    const res = await getCategoryListApi()
    categoryList.value = res.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

// 新增分类
const handleAdd = (parentId?: number) => {
  dialogTitle.value = '新增分类'
  currentId.value = undefined
  Object.assign(formData, {
    name: '',
    slug: '',
    description: '',
    parent_id: parentId,
    sort_order: 0,
    icon: '',
    is_active: true,
  })
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: Category) => {
  dialogTitle.value = '编辑分类'
  currentId.value = row.id
  Object.assign(formData, {
    name: row.name,
    slug: row.slug,
    description: row.description,
    parent_id: row.parent_id,
    sort_order: row.sort_order,
    icon: row.icon,
    is_active: row.is_active,
  })
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`确定要删除分类"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    await deleteCategoryApi(row.id)
    ElMessage.success('删除成功')
    fetchCategoryList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      if (currentId.value) {
        await updateCategoryApi(currentId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await createCategoryApi(formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      fetchCategoryList()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '操作失败')
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchCategoryList()
})
</script>

<style scoped lang="scss">
.category-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
