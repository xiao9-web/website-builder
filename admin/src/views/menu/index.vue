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
        <el-form-item label="跳转路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入跳转路径" />
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
import type { Menu } from '@/types'

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
})

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
}

// 获取菜单树
const fetchMenuTree = async () => {
  try {
    const res = await getMenuTreeApi()
    menuTree.value = res
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
  }
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
  })
  dialogVisible.value = true
}

// 新增子菜单
const handleAddChild = (data: Menu) => {
  isEdit.value = false
  Object.assign(form, {
    name: '',
    path: '',
    icon: '',
    target: '_self',
    is_visible: true,
    sort: 0,
    parent_id: data.id,
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (data: Menu) => {
  isEdit.value = true
  Object.assign(form, data)
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
        if (isEdit.value) {
          await updateMenuApi(form.id!, form)
          ElMessage.success('编辑成功')
        } else {
          await createMenuApi(form)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchMenuTree()
      } catch (error) {
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

onMounted(() => {
  fetchMenuTree()
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
