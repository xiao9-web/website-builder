<template>
  <div class="trash-container">
    <div class="toolbar">
      <div>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回文章列表
        </el-button>
        <h2 style="margin: 0 0 0 20px;">文章回收站</h2>
      </div>
      <div class="toolbar-right">
        <el-button type="warning" @click="handleBatchRestore" :disabled="selectedIds.length === 0">
          批量恢复
        </el-button>
        <el-button type="danger" @click="handleBatchPermanentDelete" :disabled="selectedIds.length === 0">
          批量永久删除
        </el-button>
      </div>
    </div>

    <el-card>
      <el-table :data="list" border v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="文章标题" min-width="200" />
        <el-table-column prop="category_id" label="所属菜单" width="120">
          <template #default="scope">
            {{ getMenuName(scope.row.category_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="deleted_at" label="删除时间" width="160">
          <template #default="scope">{{ formatTime(scope.row.deleted_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="success" size="small" link @click="handleRestore(scope.row)">
              恢复
            </el-button>
            <el-button type="danger" size="small" link @click="handlePermanentDelete(scope.row)">
              永久删除
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
import { ArrowLeft } from '@element-plus/icons-vue'
import { getMenuListApi } from '@/api/menu'
import dayjs from 'dayjs'
import request from '@/utils/request'

const router = useRouter()

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const menus = ref<any[]>([])
const selectedIds = ref<number[]>([])

const query = reactive({
  page: 1,
  pageSize: 10,
})

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const getMenuName = (categoryId: number | null) => {
  if (!categoryId) return '-'
  const menu = menus.value.find(m => m.id === categoryId)
  return menu ? menu.name : '-'
}

const fetchMenus = async () => {
  try {
    const res = await getMenuListApi()
    menus.value = res || []
  } catch (error) {
    console.error('获取菜单列表失败', error)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/articles/deleted/list', { params: query })
    list.value = res.list
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取回收站列表失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/article')
}

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleRestore = async (row: any) => {
  await ElMessageBox.confirm(`确定要恢复文章 "${row.title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await request.put(`/articles/${row.id}/restore`)
    ElMessage.success('恢复成功')
    fetchList()
  } catch (error) {
    ElMessage.error('恢复失败')
  }
}

const handleBatchRestore = async () => {
  await ElMessageBox.confirm(`确定要恢复选中的 ${selectedIds.value.length} 篇文章吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await request.put('/articles/batch/restore', { ids: selectedIds.value })
    ElMessage.success('批量恢复成功')
    fetchList()
  } catch (error) {
    ElMessage.error('批量恢复失败')
  }
}

const handlePermanentDelete = async (row: any) => {
  await ElMessageBox.confirm(
    `确定要永久删除文章 "${row.title}" 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
  try {
    await request.delete(`/articles/${row.id}/permanent`)
    ElMessage.success('永久删除成功')
    fetchList()
  } catch (error) {
    ElMessage.error('永久删除失败')
  }
}

const handleBatchPermanentDelete = async () => {
  await ElMessageBox.confirm(
    `确定要永久删除选中的 ${selectedIds.value.length} 篇文章吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
  try {
    await request.delete('/articles/batch/permanent', { data: { ids: selectedIds.value } })
    ElMessage.success('批量永久删除成功')
    fetchList()
  } catch (error) {
    ElMessage.error('批量永久删除失败')
  }
}

onMounted(() => {
  fetchMenus()
  fetchList()
})
</script>

<style scoped lang="css">
.trash-container {
  padding: 0;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar h2 {
  font-size: 20px;
  color: #333;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
