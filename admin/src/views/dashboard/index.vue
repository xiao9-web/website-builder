<template>
  <div class="dashboard-container">
    <div class="publish-section mb-20">
      <el-card>
        <div class="publish-content">
          <div class="publish-info">
            <h3>内容发布</h3>
            <p>将当前所有内容发布到前台网站</p>
          </div>
          <el-button type="primary" size="large" @click="handlePublish" :loading="publishing">
            <el-icon><Upload /></el-icon>
            <span>立即发布</span>
          </el-button>
        </div>
      </el-card>
    </div>

    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-card class="card-item">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">文章总数</p>
              <p class="card-value">{{ articleCount }}</p>
            </div>
            <div class="card-icon article-icon">
              <el-icon><Document /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-item">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">页面总数</p>
              <p class="card-value">{{ pageCount }}</p>
            </div>
            <div class="card-icon page-icon">
              <el-icon><Files /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-item">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">部署次数</p>
              <p class="card-value">{{ deployCount }}</p>
            </div>
            <div class="card-icon deploy-icon">
              <el-icon><UploadFilled /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-item">
          <div class="card-content">
            <div class="card-info">
              <p class="card-label">最后部署</p>
              <p class="card-value">{{ lastDeployTime }}</p>
            </div>
            <div class="card-icon time-icon">
              <el-icon><Clock /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card title="最近部署记录" class="mb-20">
          <el-table :data="deployList" border style="width: 100%">
            <el-table-column prop="version" label="版本号" width="180" />
            <el-table-column prop="description" label="部署描述" min-width="200" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 2 ? 'success' : scope.row.status === 3 ? 'danger' : 'warning'">
                  {{ scope.row.status === 2 ? '成功' : scope.row.status === 3 ? '失败' : '进行中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="耗时" width="80" align="center">
              <template #default="scope">{{ scope.row.duration }}s</template>
            </el-table-column>
            <el-table-column prop="created_at" label="部署时间" width="180">
              <template #default="scope">{{ formatTime(scope.row.created_at) }}</template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card title="最近文章">
          <el-table :data="articleList" border style="width: 100%">
            <el-table-column prop="title" label="文章标题" min-width="200" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
                  {{ scope.row.status === 1 ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="view_count" label="浏览量" width="80" align="center" />
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="scope">{{ formatTime(scope.row.created_at) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card title="快速操作" class="mb-20">
          <div class="quick-actions">
            <el-button type="primary" size="large" @click="goToDeploy" class="action-btn">
              <el-icon><UploadFilled /></el-icon>
              一键部署
            </el-button>
            <el-button type="success" size="large" @click="goToCreateArticle" class="action-btn">
              <el-icon><Edit /></el-icon>
              写文章
            </el-button>
            <el-button type="info" size="large" @click="goToCreatePage" class="action-btn">
              <el-icon><Plus /></el-icon>
              新建页面
            </el-button>
            <el-button type="warning" size="large" @click="goToSiteConfig" class="action-btn">
              <el-icon><Setting /></el-icon>
              网站配置
            </el-button>
          </div>
        </el-card>

        <el-card title="系统信息">
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Node版本</span>
              <span class="info-value">{{ nodeVersion }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前环境</span>
              <span class="info-value">{{ env }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">部署地址</span>
              <span class="info-value">
                <el-link type="primary" :href="deployUrl" target="_blank">{{ deployUrl }}</el-link>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Files, UploadFilled, Clock, Edit, Plus, Setting, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import request from '@/utils/request'

const router = useRouter()

const articleCount = ref(0)
const pageCount = ref(0)
const deployCount = ref(0)
const lastDeployTime = ref('暂无')
const deployList = ref<any[]>([])
const articleList = ref<any[]>([])
const nodeVersion = ref('')
const env = ref('开发环境')
const deployUrl = ref('')
const publishing = ref(false)

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const handlePublish = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要发布当前所有内容到前台网站吗？',
      '发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    publishing.value = true
    const response = await request.post('/deploy/publish', {
      description: '内容发布'
    })

    ElMessage.success('发布成功！')
    // 刷新数据
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('发布失败:', error)
      ElMessage.error(error?.response?.data?.message || '发布失败')
    }
  } finally {
    publishing.value = false
  }
}

const goToDeploy = () => {
  router.push('/deploy')
}

const goToCreateArticle = () => {
  router.push('/article/edit')
}

const goToCreatePage = () => {
  router.push('/page/edit')
}

const goToSiteConfig = () => {
  router.push('/site-config')
}

const fetchData = async () => {
  // 模拟数据，后续对接真实API
  articleCount.value = 12
  pageCount.value = 5
  deployCount.value = 28
  lastDeployTime.value = '2026-03-09 18:30'
  
  deployList.value = [
    { id: 1, version: 'v20260309.1830', description: '更新首页Banner', status: 2, duration: 12, created_at: '2026-03-09T18:30:00' },
    { id: 2, version: 'v20260308.1520', description: '新增产品介绍页面', status: 2, duration: 15, created_at: '2026-03-08T15:20:00' },
    { id: 3, version: 'v20260307.1015', description: '修复移动端适配问题', status: 2, duration: 10, created_at: '2026-03-07T10:15:00' },
  ]

  articleList.value = [
    { id: 1, title: '2026年技术趋势分析', status: 1, view_count: 1234, created_at: '2026-03-08T14:00:00' },
    { id: 2, title: 'Vue3最佳实践指南', status: 1, view_count: 892, created_at: '2026-03-05T10:30:00' },
    { id: 3, title: '云原生部署实战', status: 0, view_count: 0, created_at: '2026-03-01T16:20:00' },
  ]

  nodeVersion.value = process.versions.node
  deployUrl.value = 'https://your-website.com'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="css">
.publish-section {
  margin-bottom: 20px;
}

.publish-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.publish-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.publish-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.dashboard-container {
  padding: 0;
}

.card-item {
  margin-bottom: 20px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.article-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.deploy-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.time-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 48px;
  justify-content: flex-start;
  padding-left: 20px;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}
</style>
