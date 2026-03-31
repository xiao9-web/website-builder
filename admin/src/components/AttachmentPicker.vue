<template>
  <el-dialog
    v-model="visible"
    title="选择附件"
    width="800px"
    :close-on-click-modal="false"
  >
    <div class="attachment-picker">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="filterType" @change="fetchAttachments">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="image">图片</el-radio-button>
          <el-radio-button label="video">视频</el-radio-button>
          <el-radio-button label="document">文档</el-radio-button>
        </el-radio-group>

        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button type="primary" size="small" :icon="Upload">
            上传新文件
          </el-button>
        </el-upload>
      </div>

      <!-- 附件网格 -->
      <div v-loading="loading" class="attachment-grid">
        <div
          v-for="item in attachments"
          :key="item.id"
          class="attachment-card"
          :class="{ selected: selectedId === item.id }"
          @click="handleSelect(item)"
        >
          <div class="attachment-preview">
            <el-image
              v-if="item.type === 'image'"
              :src="getFullUrl(item.url)"
              fit="cover"
            />
            <div v-else class="file-icon">
              <el-icon :size="40"><Document /></el-icon>
            </div>
          </div>
          <div class="attachment-name" :title="item.original_name">
            {{ item.original_name }}
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="fetchAttachments"
      />
    </div>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedItem">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Upload, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  getAttachmentListApi,
  type Attachment,
} from '@/api/attachment'
import { getToken } from '@/utils/auth'

interface Props {
  modelValue: boolean
  type?: 'image' | 'video' | 'document' | ''
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', attachment: Attachment): void
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const attachments = ref<Attachment[]>([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const filterType = ref(props.type)
const selectedId = ref<number | null>(null)
const selectedItem = ref<Attachment | null>(null)

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
      type: filterType.value,
    })
    attachments.value = res.data
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取附件列表失败')
  } finally {
    loading.value = false
  }
}

const handleSelect = (item: Attachment) => {
  selectedId.value = item.id
  selectedItem.value = item
}

const handleConfirm = () => {
  if (selectedItem.value) {
    emit('select', selectedItem.value)
    visible.value = false
  }
}

const handleCancel = () => {
  visible.value = false
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

watch(visible, (val) => {
  if (val) {
    selectedId.value = null
    selectedItem.value = null
    currentPage.value = 1
    fetchAttachments()
  }
})
</script>

<style scoped lang="scss">
.attachment-picker {
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .attachment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    min-height: 300px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .attachment-card {
    border: 2px solid #e4e7ed;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }

    &.selected {
      border-color: #409eff;
      background-color: #ecf5ff;
    }

    .attachment-preview {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f7fa;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;

      .el-image {
        width: 100%;
        height: 100%;
      }

      .file-icon {
        color: #909399;
      }
    }

    .attachment-name {
      font-size: 12px;
      color: #606266;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

