<template>
  <div class="file-manager">
    <el-card>
      <template #header>
        <div class="header">
          <span>文件管理</span>
          <el-upload
            :action="`${baseURL}/uploads`"
            :headers="{ Authorization: `Bearer ${token}` }"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :show-file-list="false"
            multiple
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </template>

      <div class="toolbar">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="grid">网格</el-radio-button>
          <el-radio-button value="list">列表</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="viewMode === 'grid'" class="grid-view">
        <div v-for="file in files" :key="file.id" class="file-card">
          <div class="file-preview" @click="handlePreview(file)">
            <img v-if="isImage(file)" :src="`${baseURL}${file.url}`" />
            <el-icon v-else :size="60"><Document /></el-icon>
          </div>
          <div class="file-info">
            <div class="file-name" :title="file.original_name">{{ file.original_name }}</div>
            <div class="file-size">{{ formatSize(file.size) }}</div>
          </div>
          <div class="file-actions">
            <el-button size="small" @click="copyUrl(file)">复制链接</el-button>
            <el-button size="small" type="danger" @click="handleDelete(file)">删除</el-button>
          </div>
        </div>
      </div>

      <el-table v-else :data="files" stripe>
        <el-table-column label="预览" width="80">
          <template #default="{ row }">
            <img v-if="isImage(row)" :src="`${baseURL}${row.url}`" style="width: 50px; height: 50px; object-fit: cover" />
            <el-icon v-else :size="30"><Document /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="original_name" label="文件名" />
        <el-table-column label="大小" width="100">
          <template #default="{ row }">{{ formatSize(row.size) }}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="上传时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="copyUrl(row)">复制链接</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="loadFiles"
        @size-change="loadFiles"
      />
    </el-card>

    <el-dialog v-model="previewVisible" title="图片预览" width="800px">
      <img :src="`${baseURL}${previewFile?.url}`" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { getFileListApi, deleteFileApi } from '@/api/upload'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
const token = localStorage.getItem('token')

const viewMode = ref('grid')
const files = ref([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const previewVisible = ref(false)
const previewFile = ref(null)

const loadFiles = async () => {
  const res = await getFileListApi({ page: page.value, limit: limit.value })
  files.value = res.files
  total.value = res.total
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  loadFiles()
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const isImage = (file: any) => file.mime_type?.startsWith('image/')

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

const copyUrl = (file: any) => {
  const url = `${baseURL}${file.url}`
  navigator.clipboard.writeText(url)
  ElMessage.success('链接已复制')
}

const handlePreview = (file: any) => {
  if (isImage(file)) {
    previewFile.value = file
    previewVisible.value = true
  }
}

const handleDelete = async (file: any) => {
  await ElMessageBox.confirm('确定要删除这个文件吗？', '删除确认')
  await deleteFileApi(file.id)
  ElMessage.success('删除成功')
  loadFiles()
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  margin-bottom: 20px;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.file-card {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.file-preview {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.file-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.file-info {
  margin-bottom: 10px;
}

.file-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.file-actions {
  display: flex;
  gap: 5px;
  justify-content: center;
}
</style>
