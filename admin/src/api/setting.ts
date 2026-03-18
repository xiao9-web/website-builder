import request from '@/utils/request'

export const getSettingsApi = (group?: string) => {
  return request.get('/settings', { params: { group } })
}

export const getSettingApi = (key: string) => {
  return request.get(`/settings/${key}`)
}

export const updateSettingApi = (key: string, value: any) => {
  return request.put(`/settings/${key}`, { value })
}

export const updateSettingsApi = (settings: { key: string; value: any }[]) => {
  return request.put('/settings', settings)
}

export const initDefaultSettingsApi = () => {
  return request.post('/settings/init/defaults')
}

export const getPublicSettingsApi = () => {
  return request.get('/settings/public')
}
