<template>
  <div class="article-edit-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ articleId ? '编辑文章' : '新增文章' }}</span>
          <div class="header-actions">
            <el-button @click="handleSave(0)" :loading="loading">
              保存草稿
            </el-button>
            <el-button type="primary" @click="handleSave(1)" :loading="loading">
              发布
            </el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="访问路径" prop="slug">
              <el-input v-model="form.slug" placeholder="请输入访问路径，如：article-1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类">
              <el-input v-model="form.category_id" placeholder="请输入分类ID" type="number" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文章摘要">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-input v-model="form.cover_image" placeholder="请输入封面图片URL" />
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="tagList" multiple placeholder="请选择或输入标签" allow-create filterable>
            <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <div class="editor-wrapper">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleEditorCreated"
              class="editor"
            />
          </div>
        </el-form-item>

        <el-collapse v-model="activeNames" class="seo-collapse">
          <el-collapse-item title="SEO配置" name="seo">
            <el-form-item label="SEO标题">
              <el-input v-model="form.seo_title" placeholder="不填则默认使用文章标题" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item label="SEO描述">
              <el-input v-model="form.seo_description" type="textarea" :rows="2" placeholder="不填则默认使用文章摘要" maxlength="200" show-word-limit />
            </el-form-item>
            <el-form-item label="SEO关键词">
              <el-input v-model="form.seo_keywords" placeholder="多个关键词用英文逗号分隔" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <el-form-item label="是否公开">
          <el-switch v-model="form.is_public" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'
import { getArticleApi, createArticleApi, updateArticleApi } from '@/api/article'
import type { Article } from '@/types'
import '@wangeditor/editor/dist/css/style.css'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const articleId = ref<number | null>(route.params.id ? parseInt(route.params.id as string) : null)

const mode = ref<'default' | 'simple'>('default')
const editorRef = shallowRef<IDomEditor | null>(null)
const activeNames = ref<string[]>([])
const tagList = ref<string[]>([])
const tags = ref<string[]>(['技术', '生活', '工作', '学习', '分享', '前端', '后端', '移动端', '数据库', '云原生'])

const form = reactive<Partial<Article>>({
  title: '',
  slug: '',
  content: '',
  summary: '',
  cover_image: '',
  category_id: 0,
  tags: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  status: 0,
  is_public: true,
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入访问路径', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}

const toolbarConfig = {
  excludeKeys: ['group-video', 'fullScreen'],
}

const editorConfig = {
  placeholder: '请输入文章内容...',
  MENU_CONF: {},
}

const handleEditorCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 标签处理
watch(tagList, (newVal) => {
  form.tags = newVal.join(',')
})

// 保存
const handleSave = async (status: number) => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const data = { ...form, status }
        if (articleId.value) {
          await updateArticleApi(articleId.value, data)
          ElMessage.success('更新成功')
        } else {
          await createArticleApi(data)
          ElMessage.success('创建成功')
        }
        router.push('/article')
      } catch (error) {
        ElMessage.error(articleId.value ? '更新失败' : '创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取详情
const fetchDetail = async () => {
  if (!articleId.value) return
  loading.value = true
  try {
    const res = await getArticleApi(articleId.value)
    Object.assign(form, res)
    if (res.tags) {
      tagList.value = res.tags.split(',').filter(Boolean)
    }
  } catch (error) {
    ElMessage.error('获取文章详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped lang="css">
.article-edit-container {
  padding: 0;
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.editor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editor {
  min-height: 500px;
}

.seo-collapse {
  margin-bottom: 20px;
}
</style>
