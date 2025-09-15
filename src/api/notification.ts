import { get, post, put, del, ApiResponse } from '../utils/request'

// 通知类型 - 匹配后端返回的数据结构
export interface Notification {
  id: number
  user_id: number
  title: string
  content: string
  type?: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
  updated_at?: string
  data?: any // 额外数据
}

// 未读数量响应 - 后端直接返回数字
export type UnreadCountResponse = number

// 通知列表响应
export interface NotificationListResponse {
  list: Notification[]
  total: number
  pages: number
  size: number
}

// 获取未读通知数量
export const getUnreadNotificationCount = async (): Promise<ApiResponse<UnreadCountResponse>> => {
  return get<UnreadCountResponse>('/notification/unread-count')
}

// 获取通知列表
export const getNotifications = async (params?: {
  page?: number
  pageSize?: number
  type?: string
  isRead?: boolean
}): Promise<ApiResponse<NotificationListResponse>> => {
  return get<NotificationListResponse>('/notification', { params })
}

// 标记所有通知为已读
export const markAllNotificationsAsRead = async (): Promise<ApiResponse<null>> => {
  return post<null>('/notification/readAll')
}

// 标记单个通知为已读
export const markNotificationAsRead = async (id: string | number): Promise<ApiResponse<null>> => {
  return put<null>(`/notification/read/${id}`)
}

// 删除通知
export const deleteNotification = async (id: string | number): Promise<ApiResponse<null>> => {
  return del<null>(`/notification/${id}`)
}
