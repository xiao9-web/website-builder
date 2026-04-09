<template>
  <div class="product-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <el-button type="primary" @click="handleAdd">新增产品</el-button>
        </div>
      </template>

      <el-table :data="productList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="产品图片" width="120">
          <template #default="{ row }">
            <el-image v-if="row.image" :src="row.image" style="width: 80px; height: 80px" fit="cover" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">{{ row.price ? `¥${row.price}` : '-' }}</template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchProducts"
        @current-change="fetchProducts"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品图片" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入产品描述" />
        </el-form-item>
        <el-form-item label="产品详情" prop="detail">
          <el-input v-model="form.detail" type="textarea" :rows="5" placeholder="请输入产品详情" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">已发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi, type Product } from '@/api/product';

const productList = ref<Product[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref('新增产品');
const formRef = ref<FormInstance>();

const form = reactive({
  id: 0,
  name: '',
  image: '',
  description: '',
  detail: '',
  price: 0,
  sort: 0,
  status: 0,
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
};

const fetchProducts = async () => {
  try {
    const res = await getProductsApi({ page: page.value, pageSize: pageSize.value });
    productList.value = res.list;
    total.value = res.total;
  } catch (error) {
    ElMessage.error('获取产品列表失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '新增产品';
  dialogVisible.value = true;
};

const handleEdit = (row: Product) => {
  dialogTitle.value = '编辑产品';
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该产品吗？', '提示', { type: 'warning' });
    await deleteProductApi(row.id);
    ElMessage.success('删除成功');
    fetchProducts();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          await updateProductApi(form.id, form);
          ElMessage.success('更新成功');
        } else {
          await createProductApi(form);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchProducts();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

const resetForm = () => {
  form.id = 0;
  form.name = '';
  form.image = '';
  form.description = '';
  form.detail = '';
  form.price = 0;
  form.sort = 0;
  form.status = 0;
  formRef.value?.resetFields();
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
