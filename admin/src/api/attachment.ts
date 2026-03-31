import request from '@/utils/request'

export interface Attachment {
  id: number
  filename: string
  original_name: string
  url: string
  mime_type: string
  size: number
  type: 'image' | 'video' | 'audio' | 'document' | 'other'
  width?: number
  height?: number
  created_at: string
}

export interface AttachmentListResponse {
  data: Attachment[]
  total: number
  page: number
  limit: number
}

// 上传文件
export const uploadAttachmentApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<Attachment>('/attachment/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取附件列表
export const getAttachmentListApi = (params: {
  page?: number
  limit?: number
  type?: string
}) => {
  return request.get<AttachmentListResponse>('/attachment', { params })
}

// 获取单个附件
export const getAttachmentApi = (id: number) => {
  return request.get<Attachment>(`/attachment/${id}`)
}

// 删除附件
export const deleteAttachmentApi = (id: number) => {
  return request.delete(`/attachment/${id}`)
}
