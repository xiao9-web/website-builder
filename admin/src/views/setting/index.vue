<template>
  <div class="setting-container">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基础设置 -->
      <el-tab-pane label="基础设置" name="basic">
        <el-form :model="basicSettings" label-width="120px">
          <el-form-item label="网站名称">
            <el-input v-model="basicSettings.site_name" placeholder="请输入网站名称" />
          </el-form-item>
          <el-form-item label="网站描述">
            <el-input
              v-model="basicSettings.site_description"
              type="textarea"
              :rows="3"
              placeholder="请输入网站描述"
            />
          </el-form-item>
          <el-form-item label="网站关键词">
            <el-input
              v-model="basicSettings.site_keywords"
              placeholder="多个关键词用逗号分隔"
            />
          </el-form-item>
          <el-form-item label="网站 Logo">
            <div style="display: flex; gap: 10px; align-items: center;">
              <el-input v-model="basicSettings.site_logo" placeholder="请输入 Logo URL" />
              <el-upload
                :action="`${baseURL}/uploads`"
                :headers="{ Authorization: `Bearer ${token}` }"
                :on-success="(res) => handleUploadSuccess(res, 'site_logo')"
                :show-file-list="false"
              >
                <el-button>上传</el-button>
              </el-upload>
            </div>
            <img v-if="basicSettings.site_logo" :src="basicSettings.site_logo" style="max-width: 200px; margin-top: 10px;" />
          </el-form-item>
          <el-form-item label="网站图标">
            <div style="display: flex; gap: 10px; align-items: center;">
              <el-input v-model="basicSettings.site_favicon" placeholder="请输入图标 URL" />
              <el-upload
                :action="`${baseURL}/uploads`"
                :headers="{ Authorization: `Bearer ${token}` }"
                :on-success="(res) => handleUploadSuccess(res, 'site_favicon')"
                :show-file-list="false"
              >
                <el-button>上传</el-button>
              </el-upload>
            </div>
            <img v-if="basicSettings.site_favicon" :src="basicSettings.site_favicon" style="max-width: 50px; margin-top: 10px;" />
          </el-form-item>
          <el-form-item label="ICP 备案号">
            <el-input v-model="basicSettings.icp_number" placeholder="请输入 ICP 备案号" />
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="basicSettings.contact_email" placeholder="请输入联系邮箱" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="basicSettings.contact_phone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="basicSettings.contact_address" placeholder="请输入联系地址" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave('basic')" :loading="saving">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 主题设置 -->
      <el-tab-pane label="主题设置" name="theme">
        <el-form :model="themeSettings" label-width="120px">
          <el-form-item label="主题名称">
            <el-select v-model="themeSettings.theme_name" placeholder="请选择主题">
              <el-option label="默认主题" value="default" />
              <el-option label="暗黑主题" value="dark" />
              <el-option label="简约主题" value="simple" />
            </el-select>
          </el-form-item>
          <el-form-item label="主题色">
            <el-color-picker v-model="themeSettings.theme_color" />
          </el-form-item>
          <el-form-item label="字体">
            <el-select v-model="themeSettings.theme_font" placeholder="请选择字体">
              <el-option label="系统默认" value="system" />
              <el-option label="微软雅黑" value="Microsoft YaHei" />
              <el-option label="宋体" value="SimSun" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave('theme')" :loading="saving">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- SEO 设置 -->
      <el-tab-pane label="SEO 设置" name="seo">
        <el-form :model="seoSettings" label-width="120px">
          <el-form-item label="启用 SEO">
            <el-switch v-model="seoSettings.seo_enabled" />
          </el-form-item>
          <el-form-item label="启用 Sitemap">
            <el-switch v-model="seoSettings.sitemap_enabled" />
          </el-form-item>
          <el-form-item label="Robots.txt">
            <el-input
              v-model="seoSettings.robots_txt"
              type="textarea"
              :rows="5"
              placeholder="请输入 robots.txt 内容"
            />
          </el-form-item>
          <el-form-item label="统计代码">
            <el-input
              v-model="seoSettings.analytics_code"
              type="textarea"
              :rows="5"
              placeholder="请粘贴统计代码（如 Google Analytics）"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave('seo')" :loading="saving">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 评论设置 -->
      <el-tab-pane label="评论设置" name="comment">
        <el-form :model="commentSettings" label-width="120px">
          <el-form-item label="启用评论">
            <el-switch v-model="commentSettings.comment_enabled" />
          </el-form-item>
          <el-form-item label="评论服务商">
            <el-select v-model="commentSettings.comment_provider" placeholder="请选择评论服务商">
              <el-option label="无" value="none" />
              <el-option label="Disqus" value="disqus" />
              <el-option label="Gitalk" value="gitalk" />
            </el-select>
          </el-form-item>
          <el-form-item label="评论配置">
            <el-input
              v-model="commentSettings.comment_config"
              type="textarea"
              :rows="5"
              placeholder="请输入 JSON 格式的配置"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave('comment')" :loading="saving">
              保存设置
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSettingsApi, updateSettingsApi } from '@/api/setting'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
const token = localStorage.getItem('token')

const activeTab = ref('basic')
const saving = ref(false)

const basicSettings = reactive({
  site_name: '',
  site_description: '',
  site_keywords: '',
  site_logo: '',
  site_favicon: '',
  icp_number: '',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
})

const themeSettings = reactive({
  theme_name: 'default',
  theme_color: '#409EFF',
  theme_font: 'system',
})

const seoSettings = reactive({
  seo_enabled: true,
  sitemap_enabled: true,
  robots_txt: '',
  analytics_code: '',
})

const commentSettings = reactive({
  comment_enabled: false,
  comment_provider: 'none',
  comment_config: '{}',
})

const loadSettings = async () => {
  try {
    const res = await getSettingsApi()
    const settings = res.data || res

    settings.forEach((setting: any) => {
      const value = parseValue(setting.value, setting.type)

      if (setting.group === 'basic' && setting.key in basicSettings) {
        basicSettings[setting.key] = value
      } else if (setting.group === 'theme' && setting.key in themeSettings) {
        themeSettings[setting.key] = value
      } else if (setting.group === 'seo' && setting.key in seoSettings) {
        seoSettings[setting.key] = value
      } else if (setting.group === 'comment' && setting.key in commentSettings) {
        commentSettings[setting.key] = value
      }
    })
  } catch (error) {
    console.error('Failed to load settings:', error)
    ElMessage.error('加载设置失败')
  }
}

const parseValue = (value: string, type: string) => {
  if (!value) return type === 'boolean' ? false : ''

  switch (type) {
    case 'boolean':
      return value === 'true'
    case 'number':
      return Number(value)
    case 'json':
      try {
        return JSON.parse(value)
      } catch {
        return '{}'
      }
    default:
      return value
  }
}

const handleSave = async (group: string) => {
  saving.value = true
  try {
    let settings: any
    switch (group) {
      case 'basic':
        settings = basicSettings
        break
      case 'theme':
        settings = themeSettings
        break
      case 'seo':
        settings = seoSettings
        break
      case 'comment':
        settings = commentSettings
        break
    }

    const data = Object.keys(settings).map(key => ({
      key,
      value: settings[key],
    }))

    await updateSettingsApi(data)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('Failed to save settings:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleUploadSuccess = (res: any, key: string) => {
  basicSettings[key] = `${baseURL}${res.data.url}`
  ElMessage.success('上传成功')
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.setting-container {
  padding: 20px;
}

:deep(.el-tabs__content) {
  padding: 20px;
}

:deep(.el-form) {
  max-width: 800px;
}
</style>
