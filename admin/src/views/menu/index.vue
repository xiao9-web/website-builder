<template>
  <div class="menu-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增菜单
      </el-button>
      <el-button type="success" @click="handleSaveSort" :loading="saving">
        <el-icon><Check /></el-icon>
        保存排序
      </el-button>
    </div>

    <el-card>
      <el-tree
        ref="treeRef"
        :data="menuTree"
        :props="treeProps"
        default-expand-all
        node-key="id"
        draggable
        @node-drop="handleDrop"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-name">{{ data.name }}</span>
            <span class="node-path" v-if="data.path">({{ data.path }})</span>
            <span class="node-actions">
              <el-button
                type="primary"
                size="small"
                link
                @click.stop="handleAddChild(data)"
              >
                新增子菜单
              </el-button>
              <el-button
                type="warning"
                size="small"
                link
                @click.stop="handleEdit(data)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                link
                @click.stop="handleDelete(data)"
              >
                删除
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="关联文章">
          <el-select
            v-model="form.article_id"
            clearable
            filterable
            placeholder="选择文章后，菜单将跳转到该文章"
            style="width: 100%"
          >
            <el-option
              v-for="article in articleOptions"
              :key="article.id"
              :label="article.title"
              :value="article.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转路径" prop="path">
          <el-input v-model="form.path" :disabled="!!form.article_id" placeholder="请输入跳转路径" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="打开方式">
          <el-select v-model="form.target" placeholder="请选择打开方式">
            <el-option label="当前窗口" value="_self" />
            <el-option label="新窗口" value="_blank" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.is_visible" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type TreeInstance } from 'element-plus'
import { Plus, Check } from '@element-plus/icons-vue'
import { getMenuTreeApi, createMenuApi, updateMenuApi, deleteMenuApi, updateMenuSortApi } from '@/api/menu'
import { getArticleListApi } from '@/api/article'
import type { Menu, Article } from '@/types'

const treeRef = ref<TreeInstance>()
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const loading = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const menuTree = ref<Menu[]>([])

const treeProps = {
  children: 'children',
  label: 'name',
}

const form = reactive<Partial<Menu>>({
  name: '',
  path: '',
  icon: '',
  target: '_self',
  is_visible: true,
  sort: 0,
  parent_id: null,
  article_id: null,
})

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
}

const articleOptions = ref<Article[]>([])

const fetchArticleOptions = async () => {
  try {
    const res = await getArticleListApi({ page: 1, pageSize: 200, status: '1', sortBy: 'published_at_desc' })
    articleOptions.value = res.list
  } catch (error) {
    // 忽略，不影响菜单编辑
  }
}

// 计算菜单深度
const getMenuDepth = (menuTree: Menu[], targetId: number | null, currentDepth = 1): number => {
  for (const menu of menuTree) {
    if (menu.id === targetId) {
      return currentDepth
    }
    if (menu.children && menu.children.length > 0) {
      const depth = getMenuDepth(menu.children, targetId, currentDepth + 1)
      if (depth > 0) {
        return depth
      }
    }
  }
  return 0
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    name: '',
    path: '',
    icon: '',
    target: '_self',
    is_visible: true,
    sort: 0,
    parent_id: null,
    article_id: null,
  })
  dialogVisible.value = true
}

// 新增子菜单
const handleAddChild = (data: Menu) => {
  // 计算父菜单的深度
  const parentDepth = getMenuDepth(menuTree.value, data.id, 1)
  // 限制最多三级菜单
  if (parentDepth >= 3) {
    ElMessage.warning('最多只允许三级菜单')
    return
  }

  isEdit.value = false
  Object.assign(form, {
    name: '',
    path: '',
    icon: '',
    target: '_self',
    is_visible: true,
    sort: 0,
    parent_id: data.id,
    article_id: null,
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (data: Menu) => {
  isEdit.value = true
  // 只复制需要的字段，排除 children 等不需要的属性
  Object.assign(form, {
    id: data.id,
    name: data.name,
    path: data.path || '',
    icon: data.icon || '',
    target: data.target || '_self',
    is_visible: data.is_visible,
    sort: data.sort,
    parent_id: data.parent_id ?? null,
    article_id: data.article_id ?? null,
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (data: Menu) => {
  await ElMessageBox.confirm(`确定要删除菜单 "${data.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteMenuApi(data.id)
    ElMessage.success('删除成功')
    fetchMenuTree()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 准备提交的数据
        const submitData: any = {
          name: form.name,
          path: form.path,
          icon: form.icon,
          target: form.target,
          is_visible: form.is_visible,
          sort: form.sort,
        }

        // 处理 parent_id
        if (form.parent_id) {
          submitData.parent_id = form.parent_id
        } else {
          submitData.parent_id = null
        }

        // 处理 article_id
        if (form.article_id) {
          submitData.article_id = form.article_id
          submitData.path = '' // 若选择了文章，则优先使用文章路由；避免误配自定义 path
        } else {
          submitData.article_id = null
        }

        if (isEdit.value) {
          await updateMenuApi(form.id!, submitData)
          ElMessage.success('编辑成功')
        } else {
          await createMenuApi(submitData)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchMenuTree()
      } catch (error) {
        console.error('菜单操作失败:', error)
        ElMessage.error(isEdit.value ? '编辑失败' : '新增失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 拖拽排序
const handleDrop = () => {
  // 拖拽后自动调整顺序
}

// 保存排序
const handleSaveSort = async () => {
  // 扁平化获取所有节点ID
  const getNodeIds = (nodes: Menu[]): number[] => {
    let ids: number[] = []
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getNodeIds(node.children))
      }
    })
    return ids
  }

  const ids = getNodeIds(menuTree.value)
  saving.value = true
  try {
    await updateMenuSortApi(ids)
    ElMessage.success('排序保存成功')
    fetchMenuTree()
  } catch (error) {
    ElMessage.error('排序保存失败')
  } finally {
    saving.value = false
  }
}

// 获取菜单树
const fetchMenuTree = async () => {
  try {
    const data = await getMenuTreeApi()
    menuTree.value = data
  } catch (error) {
    console.error('获取菜单树失败:', error)
    ElMessage.error('获取菜单树失败')
  }
}

onMounted(() => {
  fetchMenuTree()
  fetchArticleOptions()
})
</script>

<style scoped lang="css">
.menu-container {
  padding: 0;
}

.toolbar {
  margin-bottom: 20px;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
}

.node-name {
  font-weight: 500;
  margin-right: 8px;
}

.node-path {
  color: #909399;
  font-size: 12px;
  margin-right: auto;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}
</style>
