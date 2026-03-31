<template>
  <div class="attachment-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件管理</span>
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" :icon="Upload">上传文件</el-button>
          </el-upload>
        </div>
      </template>

      <!-- 筛选 -->
      <div class="filter-bar">
        <el-radio-group v-model="filterType" @change="handleFilterChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="image">图片</el-radio-button>
          <el-radio-button label="video">视频</el-radio-button>
          <el-radio-button label="document">文档</el-radio-button>
          <el-radio-button label="other">其他</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 附件列表 -->
      <div v-loading="loading" class="attachment-list">
        <div
          v-for="item in attachments"
          :key="item.id"
          class="attachment-item"
          @click="handleSelect(item)"
        >
          <div class="attachment-preview">
            <el-image
              v-if="item.type === 'image'"
              :src="getFullUrl(item.url)"
              fit="cover"
              :preview-src-list="[getFullUrl(item.url)]"
            />
            <div v-else class="file-icon">
              <el-icon :size="48"><Document /></el-icon>
            </div>
          </div>
          <div class="attachment-info">
            <div class="attachment-name" :title="item.original_name">
              {{ item.original_name }}
            </div>
            <div class="attachment-meta">
              {{ formatFileSize(item.size) }} · {{ formatDate(item.created_at) }}
            </div>
          </div>
          <div class="attachment-actions">
            <el-button
              size="small"
              :icon="CopyDocument"
              @click.stop="handleCopyUrl(item)"
            >
              复制链接
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click.stop="handleDelete(item)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @current-change="fetchAttachments"
        @size-change="fetchAttachments"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Document, CopyDocument, Delete } from '@element-plus/icons-vue'
import {
  getAttachmentListApi,
  deleteAttachmentApi,
  type Attachment,
} from '@/api/attachment'
import { getToken } from '@/utils/auth'

const loading = ref(false)
const attachments = ref<Attachment[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const filterType = ref('')

const uploadUrl = computed(() => {
  return import.meta.env.VITE_API_BASE_URL + '/attachment/upload'
})

const uploadHeaders = computed(() => {
  return {
    Authorization: `Bearer ${getToken()}`,
  }
})

const getFullUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }
  return import.meta.env.VITE_API_BASE_URL + url
}

const fetchAttachments = async () => {
  loading.value = true
  try {
    const res = await getAttachmentListApi({
      page: currentPage.value,
      limit: pageSize.value,
      type: filterType.value || undefined,
    })
    attachments.value = res.data
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取附件列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchAttachments()
}

const beforeUpload = (file: File) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  return true
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  fetchAttachments()
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const handleSelect = (item: Attachment) => {
  console.log('Selected:', item)
}

const handleCopyUrl = async (item: Attachment) => {
  const url = getFullUrl(item.url)
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const handleDelete = async (item: Attachment) => {
  try {
    await ElMessageBox.confirm('确定要删除这个附件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteAttachmentApi(item.id)
    ElMessage.success('删除成功')
    fetchAttachments()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchAttachments()
})
</script>

<style scoped>
.attachment-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-bar {
  margin-bottom: 20px;
}

.attachment-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  min-height: 400px;
}

.attachment-item {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.attachment-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.attachment-preview {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.attachment-preview :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.file-icon {
  color: var(--el-text-color-secondary);
}

.attachment-info {
  margin-bottom: 8px;
}

.attachment-name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.attachment-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.attachment-actions {
  display: flex;
  gap: 8px;
}

.attachment-actions .el-button {
  flex: 1;
}
</style>
