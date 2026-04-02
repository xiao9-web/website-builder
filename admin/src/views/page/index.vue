<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>页面管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="showTemplateDialog = true">从模板创建</el-button>
            <el-button @click="handleAdd">空白页面</el-button>
          </div>
        </div>
      </template>

      <el-table :data="pageList" style="width: 100%">
        <el-table-column prop="title" label="页面标题" />
        <el-table-column prop="slug" label="路径" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">
              {{ row.status === '1' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="success" @click="handlePreview(row)">预览</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 模板选择对话框 -->
    <el-dialog v-model="showTemplateDialog" title="选择页面模板" width="800px">
      <div class="template-grid">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-card"
          @click="handleCreateFromTemplate(template)"
        >
          <div class="template-preview">{{ template.icon }}</div>
          <h3>{{ template.name }}</h3>
          <p>{{ template.description }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPageListApi, deletePageApi, createPageApi } from '@/api/page'
import type { Page } from '@/api/page'
import {
  homepageTemplate,
  aboutTemplate,
  productTemplate,
  contactTemplate,
} from '@/templates'

const router = useRouter()
const pageList = ref<Page[]>([])
const showTemplateDialog = ref(false)

const templates = [
  {
    id: 'homepage',
    name: '首页模板',
    description: '网站首页，Hero区+特性展示',
    icon: '🏠',
    config: homepageTemplate,
  },
  {
    id: 'about',
    name: '关于我们',
    description: '公司介绍、团队展示',
    icon: '🏢',
    config: aboutTemplate,
  },
  {
    id: 'product',
    name: '产品展示',
    description: '产品列表、服务介绍',
    icon: '📦',
    config: productTemplate,
  },
  {
    id: 'contact',
    name: '联系我们',
    description: '联系方式、留言表单',
    icon: '📞',
    config: contactTemplate,
  },
]

const loadPages = async () => {
  try {
    const res = await getPageListApi({ page: 1, pageSize: 100 })
    pageList.value = res.list
  } catch (error) {
    console.error('加载页面列表失败:', error)
    ElMessage.error('加载页面列表失败')
  }
}

const handleAdd = () => {
  router.push('/page/edit')
}

const handleCreateFromTemplate = async (template: any) => {
  try {
    console.log('Creating page from template:', template.config)
    const res = await createPageApi({
      title: template.config.settings.title,
      slug: template.id + '-' + Date.now(),
      layout_config: template.config,
      status: '0', // PageStatus.DRAFT
    })
    ElMessage.success('页面创建成功')
    showTemplateDialog.value = false
    router.push(`/page/edit?id=${res.id}`)
  } catch (error: any) {
    console.error('创建页面失败:', error)
    console.error('错误详情:', error.response?.data)
    ElMessage.error(error.response?.data?.message || '创建页面失败')
  }
}

const handleEdit = (row: any) => {
  router.push(`/page/edit?id=${row.id}`)
}

const handlePreview = (row: any) => {
  // 在新窗口打开预览页面
  const previewUrl = `http://localhost:5174/page/${row.id}`
  window.open(previewUrl, '_blank')
}

const handleDelete = async (row: any) => {
  try {
    await deletePageApi(row.id)
    ElMessage.success('删除成功')
    loadPages()
  } catch (error) {
    console.error('删除页面失败:', error)
    ElMessage.error('删除页面失败')
  }
}

// 页面可见性监听，返回时自动刷新
const handleVisibilityChange = () => {
  if (!document.hidden) {
    loadPages()
  }
}

onMounted(() => {
  loadPages()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px 0;
}

.template-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.template-preview {
  font-size: 48px;
  margin-bottom: 16px;
}

.template-card h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
}

.template-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}
</style>
