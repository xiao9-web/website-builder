<template>
  <div class="deploy-container">
    <el-card>
      <template #header>
        <span>一键部署</span>
      </template>

      <el-alert
        title="部署说明"
        type="info"
        description="点击部署按钮将自动构建并部署网站到阿里云 OSS，并刷新 CDN 缓存"
        :closable="false"
        style="margin-bottom: 20px"
      />

      <el-form :model="form" label-width="120px">
        <el-form-item label="部署环境">
          <el-radio-group v-model="form.environment">
            <el-radio label="production">生产环境</el-radio>
            <el-radio label="staging">测试环境</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="部署说明">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入本次部署的说明（可选）"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="deploying"
            @click="handleDeploy"
          >
            {{ deploying ? '部署中...' : '开始部署' }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left">部署历史</el-divider>

      <el-table :data="deployHistory" style="width: 100%">
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="environment" label="环境" width="100">
          <template #default="{ row }">
            <el-tag :type="row.environment === 'production' ? 'success' : 'warning'">
              {{ row.environment === 'production' ? '生产' : '测试' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" />
        <el-table-column prop="deployed_at" label="部署时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleRollback(row)">回滚</el-button>
            <el-button link type="info" @click="handleViewLog(row)">查看日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const deploying = ref(false)
const form = ref({
  environment: 'production',
  description: ''
})
const deployHistory = ref([])

const loadDeployHistory = async () => {
  // TODO: 调用 API 加载部署历史
  deployHistory.value = []
}

const handleDeploy = async () => {
  deploying.value = true
  try {
    // TODO: 调用 API 执行部署
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('部署成功')
    loadDeployHistory()
  } catch (error) {
    ElMessage.error('部署失败')
  } finally {
    deploying.value = false
  }
}

const handleRollback = (row: any) => {
  ElMessage.info('回滚功能开发中')
}

const handleViewLog = (row: any) => {
  ElMessage.info('查看日志功能开发中')
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    success: 'success',
    failed: 'danger',
    deploying: 'warning'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    deploying: '部署中'
  }
  return map[status] || status
}

onMounted(() => {
  loadDeployHistory()
})
</script>
