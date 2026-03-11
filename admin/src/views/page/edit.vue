<template>
  <div class="page-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ pageId ? '编辑页面' : '新建页面' }}</span>
          <div>
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </template>

      <el-form :model="form" label-width="100px">
        <el-form-item label="页面标题">
          <el-input v-model="form.title" placeholder="请输入页面标题" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.slug" placeholder="请输入页面路径" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="页面内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="请输入页面内容"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const pageId = ref(route.query.id as string)

const form = ref({
  title: '',
  slug: '',
  status: 'draft',
  content: ''
})

const loadPage = async () => {
  if (!pageId.value) return
  // TODO: 调用 API 加载页面详情
}

const handleSave = async () => {
  // TODO: 调用 API 保存页面
  ElMessage.success('保存成功')
  goBack()
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadPage()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
