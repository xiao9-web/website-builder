<template>
  <div class="article-container">
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增文章
      </el-button>
      <div class="toolbar-right">
        <el-input
          v-model="query.keyword"
          placeholder="搜索文章标题"
          style="width: 200px; margin-right: 10px"
          clearable
          @keyup.enter="fetchList"
        />
        <el-select
          v-model="query.status"
          placeholder="状态"
          style="width: 120px; margin-right: 10px"
          clearable
          @change="fetchList"
        >
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
          <el-option label="已归档" :value="2" />
        </el-select>
        <el-button type="info" @click="fetchList">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>

    <el-card>
      <el-table :data="list" border v-loading="loading">
        <el-table-column prop="title" label="文章标题" min-width="200" />
        <el-table-column prop="slug" label="访问路径" width="150" />
        <el-table-column prop="category_id" label="分类" width="100" />
        <el-table-column prop="tags" label="标签" width="150" show-overflow-tooltip />
        <el-table-column prop="view_count" label="浏览量" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="published_at" label="发布时间" width="160">
          <template #default="scope">
            {{ scope.row.published_at ? formatTime(scope.row.published_at) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160">
          <template #default="scope">{{ formatTime(scope.row.created_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="success" size="small" link @click="handleView(scope.row)">
              预览
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getArticleListApi, deleteArticleApi } from '@/api/article'
import dayjs from 'dayjs'
import type { Article } from '@/types'

const router = useRouter()
const loading = ref(false)
const list = ref<Article[]>([])
const total = ref(0)

const query = reactive({
  page: 1,
  pageSize: 10,
  keyword: '',
  status: undefined as number | undefined,
})

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getArticleListApi(query)
    list.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  router.push('/article/edit')
}

const handleEdit = (row: Article) => {
  router.push(`/article/edit/${row.id}`)
}

const handleView = (row: Article) => {
  window.open(`/article/${row.slug}`, '_blank')
}

const handleDelete = async (row: Article) => {
  await ElMessageBox.confirm(`确定要删除文章 "${row.title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteArticleApi(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="css">
.article-container {
  padding: 0;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
