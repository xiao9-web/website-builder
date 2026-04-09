import request from '@/utils/request';

export interface Product {
  id: number;
  name: string;
  image?: string;
  description?: string;
  detail?: string;
  price?: number;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  list: Product[];
  total: number;
}

export const getProductsApi = (params: {
  page?: number;
  pageSize?: number;
  status?: number;
}): Promise<ProductListResponse> => {
  return request.get('/products', { params });
};

export const getProductApi = (id: number): Promise<Product> => {
  return request.get(`/products/${id}`);
};

export const createProductApi = (data: Partial<Product>): Promise<Product> => {
  return request.post('/products', data);
};

export const updateProductApi = (id: number, data: Partial<Product>): Promise<Product> => {
  return request.patch(`/products/${id}`, data);
};

export const deleteProductApi = (id: number): Promise<void> => {
  return request.delete(`/products/${id}`);
};

export const updateProductSortApi = (id: number, sort: number): Promise<Product> => {
  return request.patch(`/products/${id}/sort`, { sort });
};
