import request from '@/utils/request'

export const getSettingsApi = (group?: string) => {
  return request.get('/setting', { params: { group } })
}

export const getSettingApi = (key: string) => {
  return request.get(`/setting/${key}`)
}

export const updateSettingApi = (key: string, value: any) => {
  return request.put(`/setting/${key}`, { value })
}

export const updateSettingsApi = (settings: { key: string; value: any }[]) => {
  return request.put('/setting', settings)
}

export const initDefaultSettingsApi = () => {
  return request.get('/setting/init/defaults')
}

export const getPublicSettingsApi = () => {
  return request.get('/setting/public')
}
