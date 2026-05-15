<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">控制台</h2>
        <p class="page-desc">欢迎回来，{{ userInfo?.nickname || userInfo?.username }}</p>
      </div>
      <el-button type="primary" :loading="publishing" @click="handlePublish" class="publish-btn">
        <el-icon v-if="!publishing"><Upload /></el-icon>
        {{ publishing ? '发布中...' : '立即发布' }}
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <div class="stat-card" @click="$router.push('/article')">
          <div class="stat-icon" style="--icon-color: var(--stat-article-color); --icon-bg: var(--stat-article-bg)">
            <el-icon size="22"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.articleCount }}</span>
            <span class="stat-label">文章总数</span>
          </div>
          <el-icon class="stat-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" @click="$router.push('/page')">
          <div class="stat-icon" style="--icon-color: var(--stat-page-color); --icon-bg: var(--stat-page-bg)">
            <el-icon size="22"><Files /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pageCount }}</span>
            <span class="stat-label">页面总数</span>
          </div>
          <el-icon class="stat-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" @click="$router.push('/deploy')">
          <div class="stat-icon" style="--icon-color: var(--stat-deploy-color); --icon-bg: var(--stat-deploy-bg)">
            <el-icon size="22"><UploadFilled /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.deployCount }}</span>
            <span class="stat-label">部署次数</span>
          </div>
          <el-icon class="stat-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-card--no-click">
          <div class="stat-icon" style="--icon-color: var(--stat-time-color); --icon-bg: var(--stat-time-bg)">
            <el-icon size="22"><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value stat-value--sm">{{ stats.lastDeployTime }}</span>
            <span class="stat-label">最后部署</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-card class="section-card" shadow="never">
      <template #header>
        <span class="section-title">快速操作</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="quick-action" @click="$router.push('/article/edit')">
            <div class="qa-icon qa-icon--blue"><el-icon size="20"><Edit /></el-icon></div>
            <span class="qa-label">写文章</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-action" @click="$router.push('/page/edit')">
            <div class="qa-icon qa-icon--purple"><el-icon size="20"><Plus /></el-icon></div>
            <span class="qa-label">新建页面</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-action" @click="$router.push('/site-config')">
            <div class="qa-icon qa-icon--orange"><el-icon size="20"><Setting /></el-icon></div>
            <span class="qa-label">网站配置</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quick-action" @click="$router.push('/deploy')">
            <div class="qa-icon qa-icon--green"><el-icon size="20"><UploadFilled /></el-icon></div>
            <span class="qa-label">部署管理</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 数据表格 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="card-header-flex">
              <span class="section-title">最近部署记录</span>
              <el-button link type="primary" size="small" @click="$router.push('/deploy')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="deployList" style="width: 100%" :show-header="true">
            <el-table-column prop="version" label="版本号" width="160" />
            <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 2 ? 'success' : row.status === 3 ? 'danger' : 'warning'" size="small">
                  {{ row.status === 2 ? '成功' : row.status === 3 ? '失败' : '进行中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="耗时" width="70" align="center">
              <template #default="{ row }">{{ row.duration }}s</template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" width="140">
              <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
            </el-table-column>
          </el-table>
          <el-empty v-if="!deployList.length" description="暂无部署记录" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="section-card" shadow="never">
          <template #header>
            <span class="section-title">系统信息</span>
          </template>
          <div class="sys-info">
            <div class="sys-item">
              <span class="sys-label">系统版本</span>
              <span class="sys-value">v1.0.0</span>
            </div>
            <div class="sys-item">
              <span class="sys-label">Node 版本</span>
              <span class="sys-value">{{ nodeVersion }}</span>
            </div>
            <div class="sys-item">
              <span class="sys-label">运行环境</span>
              <el-tag type="success" size="small">{{ envLabel }}</el-tag>
            </div>
            <div class="sys-item">
              <span class="sys-label">部署地址</span>
              <el-link type="primary" :href="deployUrl" target="_blank" class="sys-link">{{ deployUrl }}</el-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="section-card" shadow="never" style="margin-top: 20px;">
      <template #header>
        <div class="card-header-flex">
          <span class="section-title">最近文章</span>
          <el-button link type="primary" size="small" @click="$router.push('/article')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="articleList" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="view_count" label="浏览" width="80" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="140">
          <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="$router.push(`/article/edit?id=${row.id}`)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!articleList.length" description="暂无文章" :image-size="60" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Files, UploadFilled, Clock, Edit, Plus, Setting, Upload, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import request from '@/utils/request'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const publishing = ref(false)
const deployList = ref<any[]>([])
const articleList = ref<any[]>([])
const nodeVersion = ref(typeof process !== 'undefined' ? process.versions?.node || '' : '')
const deployUrl = ref('https://your-website.com')

const stats = ref({
  articleCount: 0,
  pageCount: 0,
  deployCount: 0,
  lastDeployTime: '暂无',
})

const envLabel = import.meta.env.MODE === 'production' ? '生产环境' : '开发环境'

const formatTime = (time: string) => dayjs(time).format('MM-DD HH:mm')

const handlePublish = async () => {
  try {
    await ElMessageBox.confirm('确定要将当前所有内容发布到前台吗？', '发布确认', {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'warning',
    })
    publishing.value = true
    await request.post('/deploy/publish', { description: '内容发布' })
    ElMessage.success('发布成功！')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error?.response?.data?.message || '发布失败')
    }
  } finally {
    publishing.value = false
  }
}

const fetchData = async () => {
  // TODO: 替换为真实 API
  stats.value = {
    articleCount: 12,
    pageCount: 5,
    deployCount: 28,
    lastDeployTime: '03-09 18:30',
  }
  deployList.value = [
    { id: 1, version: 'v20260309.1830', description: '更新首页 Banner', status: 2, duration: 12, created_at: '2026-03-09T18:30:00' },
    { id: 2, version: 'v20260308.1520', description: '新增产品介绍页面', status: 2, duration: 15, created_at: '2026-03-08T15:20:00' },
    { id: 3, version: 'v20260307.1015', description: '修复移动端适配问题', status: 2, duration: 10, created_at: '2026-03-07T10:15:00' },
  ]
  articleList.value = [
    { id: 1, title: '2026年技术趋势分析', status: 1, view_count: 1234, created_at: '2026-03-08T14:00:00' },
    { id: 2, title: 'Vue3 最佳实践指南', status: 1, view_count: 892, created_at: '2026-03-05T10:30:00' },
    { id: 3, title: '云原生部署实战', status: 0, view_count: 0, created_at: '2026-03-01T16:20:00' },
  ]
}

onMounted(fetchData)
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* 页面标题 */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.page-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.publish-btn {
  height: 40px;
  padding: 0 var(--space-5);
  gap: var(--space-2);
}

/* 统计卡片 */
.stat-row {
  /* no extra margin needed, gap from .dashboard */
}

.stat-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  cursor: pointer;
  transition: all var(--transition-base);
}

.stat-card:hover:not(.stat-card--no-click) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-border);
}

.stat-card--no-click {
  cursor: default;
}

.stat-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: var(--radius-lg);
  background: var(--icon-bg);
  color: var(--icon-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-value--sm {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: 1.4;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.stat-arrow {
  color: var(--color-text-tertiary);
  font-size: 16px;
}

/* 区块卡片 */
.section-card {
  border: 1px solid var(--color-border-light) !important;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 快速操作 */
.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-base);
  background: var(--color-bg-page);
}

.quick-action:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.qa-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.qa-icon--blue   { background: var(--stat-article-color); }
.qa-icon--purple { background: var(--stat-page-color); }
.qa-icon--orange { background: var(--color-warning); }
.qa-icon--green  { background: var(--stat-deploy-color); }

.qa-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

/* 系统信息 */
.sys-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sys-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.sys-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sys-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.sys-value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.sys-link {
  font-size: var(--text-sm);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
