<template>
  <div class="tag-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>标签管理</span>
          <div>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索标签"
              style="width: 200px; margin-right: 10px"
              clearable
              @clear="fetchTagList"
              @keyup.enter="fetchTagList"
            >
              <template #append>
                <el-button :icon="Search" @click="fetchTagList" />
              </template>
            </el-input>
            <el-button type="primary" @click="handleAdd">新增标签</el-button>
            <el-button
              type="danger"
              :disabled="selectedIds.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tagList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="标签名称" min-width="150" />
        <el-table-column prop="slug" label="标识" width="150" />
        <el-table-column prop="usage_count" label="使用次数" width="100" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchTagList"
        @current-change="fetchTagList"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标识" prop="slug">
          <el-input v-model="formData.slug" placeholder="留空自动生成" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  getTagListApi,
  createTagApi,
  updateTagApi,
  deleteTagApi,
  batchDeleteTagsApi,
  type Tag,
  type CreateTagDto,
} from '@/api/tag'

const tagList = ref<Tag[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const searchKeyword = ref('')
const selectedIds = ref<number[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const formRef = ref<FormInstance>()
const currentId = ref<number>()

const formData = reactive<CreateTagDto>({
  name: '',
  slug: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 获取标签列表
const fetchTagList = async () => {
  try {
    const res = await getTagListApi({
      page: currentPage.value,
      limit: pageSize.value,
      search: searchKeyword.value,
    })
    tagList.value = res.data.data
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取标签列表失败')
  }
}

// 选择变化
const handleSelectionChange = (selection: Tag[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增标签
const handleAdd = () => {
  dialogTitle.value = '新增标签'
  currentId.value = undefined
  Object.assign(formData, {
    name: '',
    slug: '',
  })
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row: Tag) => {
  dialogTitle.value = '编辑标签'
  currentId.value = row.id
  Object.assign(formData, {
    name: row.name,
    slug: row.slug,
  })
  dialogVisible.value = true
}

// 删除标签
const handleDelete = async (row: Tag) => {
  try {
    await ElMessageBox.confirm(`确定要删除标签"${row.name}"吗？`, '提示', {
      type: 'warning',
    })
    await deleteTagApi(row.id)
    ElMessage.success('删除成功')
    fetchTagList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个标签吗？`, '提示', {
      type: 'warning',
    })
    await batchDeleteTagsApi(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchTagList()
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
        await updateTagApi(currentId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await createTagApi(formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      fetchTagList()
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
  fetchTagList()
})
</script>

<style scoped lang="scss">
.tag-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
