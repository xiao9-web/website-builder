<template>
  <div class="site-config-container">
    <el-card>
      <template #header>
        <span>网站配置</span>
      </template>

      <el-form :model="form" label-width="120px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="网站名称">
          <el-input v-model="form.site_name" placeholder="请输入网站名称" />
        </el-form-item>
        <el-form-item label="网站标题">
          <el-input v-model="form.site_title" placeholder="请输入网站标题" />
        </el-form-item>
        <el-form-item label="网站描述">
          <el-input
            v-model="form.site_description"
            type="textarea"
            :rows="3"
            placeholder="请输入网站描述"
          />
        </el-form-item>
        <el-form-item label="网站关键词">
          <el-input v-model="form.site_keywords" placeholder="请输入网站关键词，用逗号分隔" />
        </el-form-item>

        <el-divider content-position="left">联系方式</el-divider>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.contact_email" placeholder="请输入联系邮箱" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contact_phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="form.contact_address" placeholder="请输入公司地址" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  site_name: '',
  site_title: '',
  site_description: '',
  site_keywords: '',
  contact_email: '',
  contact_phone: '',
  contact_address: ''
})

const loadConfig = async () => {
  // TODO: 调用 API 加载网站配置
}

const handleSave = async () => {
  // TODO: 调用 API 保存网站配置
  ElMessage.success('保存成功')
}

onMounted(() => {
  loadConfig()
})
</script>
