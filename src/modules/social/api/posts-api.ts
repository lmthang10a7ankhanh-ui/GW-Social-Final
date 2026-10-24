import { request } from './http-client'
import type { Post, PostInput } from '../types/post'

export const postsApi = {
  // Lấy danh sách bài viết từ Backend .NET Core
  list: async (): Promise<Post[]> => {
    const res = await request<unknown>('/v1/hubs/HubsChannel')

    // Kiểm tra và bóc tách dữ liệu an toàn
    if (Array.isArray(res)) return res as Post[]
    if (
      res &&
      typeof res === 'object' &&
      'data' in res &&
      Array.isArray((res as { data: unknown }).data)
    ) {
      return (res as { data: Post[] }).data
    }

    return []
  },

  // Thêm mới
  create: (input: PostInput) =>
    request<Post>('/v1/hubs/HubsChannel', { method: 'POST', body: JSON.stringify(input) }),

  // Cập nhật
  update: (id: string | number, input: PostInput) =>
    request<Post>(`/v1/hubs/HubsChannel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),

  delete: (id: string | number) =>
    request<void>(`/v1/hubs/HubsChannel/${id}`, {
      method: 'DELETE',
    }),
}
