<template>
  <div class="media-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>媒体库</span>
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            multiple
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </template>

      <div class="filter-bar">
        <el-radio-group v-model="filterType" @change="handleFilterChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="image">图片</el-radio-button>
          <el-radio-button label="video">视频</el-radio-button>
          <el-radio-button label="file">文件</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="keyword"
          placeholder="搜索文件名"
          style="width: 300px; margin-left: 20px"
          clearable
          @clear="fetchMedia"
          @keyup.enter="fetchMedia"
        >
          <template #append>
            <el-button @click="fetchMedia">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="stats-bar">
        <el-tag>总计: {{ stats.total }}</el-tag>
        <el-tag type="success">图片: {{ stats.images }}</el-tag>
        <el-tag type="warning">视频: {{ stats.videos }}</el-tag>
        <el-tag type="info">文件: {{ stats.files }}</el-tag>
        <el-tag>总大小: {{ formatSize(stats.totalSize) }}</el-tag>
      </div>

      <div class="media-grid">
        <div v-for="item in mediaList" :key="item.id" class="media-item" @click="handlePreview(item)">
          <div class="media-preview">
            <el-image v-if="item.type === 'image'" :src="getFullUrl(item.url)" fit="cover" style="width: 100%; height: 100%" />
            <div v-else class="file-icon">📄</div>
          </div>
          <div class="media-info">
            <div class="media-name" :title="item.original_name">{{ item.original_name }}</div>
            <div class="media-meta">
              <span>{{ formatSize(item.size) }}</span>
              <span v-if="item.width && item.height">{{ item.width }}x{{ item.height }}</span>
            </div>
          </div>
          <div class="media-actions">
            <el-button link type="primary" size="small" @click.stop="handleCopyUrl(item)">复制</el-button>
            <el-button link type="danger" size="small" @click.stop="handleDelete(item)">删除</el-button>
          </div>
        </div>
      </div>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 40, 60, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchMedia"
        @current-change="fetchMedia"
      />
    </el-card>

    <el-dialog v-model="previewVisible" title="预览" width="800px">
      <div v-if="currentMedia" class="preview-content">
        <el-image v-if="currentMedia.type === 'image'" :src="getFullUrl(currentMedia.url)" fit="contain" style="width: 100%" />
        <video v-else-if="currentMedia.type === 'video'" :src="getFullUrl(currentMedia.url)" controls style="width: 100%" />
        <div v-else class="file-preview">
          <div style="font-size: 100px">📄</div>
          <p>{{ currentMedia.original_name }}</p>
        </div>
        <div class="preview-info">
          <p><strong>文件名:</strong> {{ currentMedia.original_name }}</p>
          <p><strong>大小:</strong> {{ formatSize(currentMedia.size) }}</p>
          <p v-if="currentMedia.width && currentMedia.height"><strong>尺寸:</strong> {{ currentMedia.width }}x{{ currentMedia.height }}</p>
          <p><strong>URL:</strong> {{ getFullUrl(currentMedia.url) }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getMediaListApi, deleteMediaApi, getMediaStatsApi, type Media, type MediaStats, MediaType } from '@/api/media';

const mediaList = ref<Media[]>([]);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const filterType = ref('');
const keyword = ref('');
const previewVisible = ref(false);
const currentMedia = ref<Media | null>(null);
const stats = ref<MediaStats>({ total: 0, images: 0, videos: 0, files: 0, totalSize: 0 });

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/media/upload`;
const uploadHeaders = { Authorization: `Bearer ${localStorage.getItem('token')}` };

const fetchMedia = async () => {
  try {
    const res = await getMediaListApi({ page: page.value, pageSize: pageSize.value, type: filterType.value as MediaType, keyword: keyword.value });
    mediaList.value = res.list;
    total.value = res.total;
  } catch (error) {
    ElMessage.error('获取媒体列表失败');
  }
};

const fetchStats = async () => {
  try {
    stats.value = await getMediaStatsApi();
  } catch (error) {
    console.error('获取统计信息失败:', error);
  }
};

const handleFilterChange = () => {
  page.value = 1;
  fetchMedia();
};

const beforeUpload = (file: File) => {
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB');
  }
  return isLt100M;
};

const handleUploadSuccess = () => {
  ElMessage.success('上传成功');
  fetchMedia();
  fetchStats();
};

const handleUploadError = () => {
  ElMessage.error('上传失败');
};

const handlePreview = (item: Media) => {
  currentMedia.value = item;
  previewVisible.value = true;
};

const handleCopyUrl = async (item: Media) => {
  const url = getFullUrl(item.url);
  try {
    await navigator.clipboard.writeText(url);
    ElMessage.success('链接已复制');
  } catch (error) {
    ElMessage.error('复制失败');
  }
};

const handleDelete = async (item: Media) => {
  try {
    await ElMessageBox.confirm('确定要删除该文件吗？', '提示', { type: 'warning' });
    await deleteMediaApi(item.id);
    ElMessage.success('删除成功');
    fetchMedia();
    fetchStats();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const getFullUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

onMounted(() => {
  fetchMedia();
  fetchStats();
});
</script>

<style scoped>
.media-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.stats-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.media-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}
.media-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.media-preview {
  width: 100%;
  height: 150px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-icon {
  font-size: 60px;
}
.media-info {
  padding: 10px;
}
.media-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}
.media-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  justify-content: space-between;
}
.media-actions {
  padding: 0 10px 10px;
  display: flex;
  justify-content: space-between;
}
.preview-content {
  text-align: center;
}
.file-preview {
  padding: 40px;
}
.preview-info {
  margin-top: 20px;
  text-align: left;
}
.preview-info p {
  margin: 10px 0;
}
.el-pagination {
  justify-content: flex-end;
}
</style>
