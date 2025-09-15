import { get, put, post, ApiResponse } from '@/utils/request'

// 用户资料更新表单 - 对应后端 UpdateUserRequest
export interface UpdateProfileForm {
  email?: string
  phone?: string
  displayName?: string
  firstName?: string
  lastName?: string
  locale?: string
  timezone?: string
  gender?: string
  extra?: string
  avatar?: string
}

// 用户基本信息更新表单 - 对应后端 UserBasicInfoUpdate
export interface UpdateBasicInfoForm {
  fatherCallName?: string
  motherCallName?: string
  wifiName?: string
  wifiPassword?: string
}

// 用户偏好设置表单
export interface UpdatePreferencesForm {
  emailNotifications: boolean
}

// 密码修改表单
export interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// 头像上传响应
export interface AvatarUploadResponse {
  avatar: string
  url: string
}

// 获取用户资料
export const getProfile = async (): Promise<ApiResponse<any>> => {
  return get('/auth/info')
}

// 更新用户资料 - 对应 PUT /auth/update
export const updateProfile = async (data: UpdateProfileForm): Promise<ApiResponse<null>> => {
  return put('/auth/update', data)
}

// 更新用户基本信息 - 对应 POST /auth/update/basic/info
export const updateBasicInfo = async (data: UpdateBasicInfoForm): Promise<ApiResponse<null>> => {
  return post('/auth/update/basic/info', data)
}

// 更新用户偏好设置 - 对应 PUT /auth/update/preferences
export const updatePreferences = async (data: UpdatePreferencesForm): Promise<ApiResponse<null>> => {
  return put('/auth/update/preferences', data)
}

// 修改密码
export const changePassword = async (data: ChangePasswordForm): Promise<ApiResponse<null>> => {
  return post('/auth/change-password', data)
}

// 上传头像
export const uploadAvatar = async (file: File): Promise<ApiResponse<AvatarUploadResponse>> => {
  const formData = new FormData()
  formData.append('avatar', file)
  return post('/auth/upload-avatar', formData)
}

// 启用/禁用两步验证
export const toggleTwoFactor = async (enabled: boolean): Promise<ApiResponse<null>> => {
  return post('/auth/two-factor', { enabled })
}
