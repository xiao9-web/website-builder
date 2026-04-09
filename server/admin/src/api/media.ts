import request from '@/utils/request';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  type: MediaType;
  mime_type?: string;
  size: number;
  width?: number;
  height?: number;
  description?: string;
  created_at: string;
}

export interface MediaListResponse {
  list: Media[];
  total: number;
}

export interface MediaStats {
  total: number;
  images: number;
  videos: number;
  files: number;
  totalSize: number;
}

export const uploadMediaApi = (file: File): Promise<Media> => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadMultipleMediaApi = (files: File[]): Promise<Media[]> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return request.post('/media/upload-multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMediaListApi = (params: {
  page?: number;
  pageSize?: number;
  type?: MediaType;
  keyword?: string;
}): Promise<MediaListResponse> => {
  return request.get('/media', { params });
};

export const getMediaApi = (id: number): Promise<Media> => {
  return request.get(`/media/${id}`);
};

export const updateMediaApi = (id: number, data: Partial<Media>): Promise<Media> => {
  return request.patch(`/media/${id}`, data);
};

export const deleteMediaApi = (id: number): Promise<void> => {
  return request.delete(`/media/${id}`);
};

export const getMediaStatsApi = (): Promise<MediaStats> => {
  return request.get('/media/stats');
};
