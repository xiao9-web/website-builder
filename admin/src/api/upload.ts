import request from '@/utils/request'

export const uploadFileApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getFileListApi = (params: { page?: number; limit?: number }) => {
  return request.get('/upload', { params })
}

export const deleteFileApi = (id: number) => {
  return request.delete(`/upload/${id}`)
}
