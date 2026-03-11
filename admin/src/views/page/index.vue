<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>页面管理</span>
          <el-button type="primary" @click="handleAdd">新建页面</el-button>
        </div>
      </template>

      <el-table :data="pageList" style="width: 100%">
        <el-table-column prop="title" label="页面标题" />
        <el-table-column prop="slug" label="路径" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const pageList = ref([])

const loadPages = async () => {
  // TODO: 调用 API 加载页面列表
  pageList.value = []
}

const handleAdd = () => {
  router.push('/page/edit')
}

const handleEdit = (row: any) => {
  router.push(`/page/edit?id=${row.id}`)
}

const handleDelete = async (row: any) => {
  // TODO: 调用 API 删除页面
  ElMessage.success('删除成功')
  loadPages()
}

onMounted(() => {
  loadPages()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
