export type PostInput = {
  id?: string | number // Thêm id để phục vụ cho API cập nhật (PUT)
  cnName: string
  cnUrl: string
  cnIcon?: string
  cnStyle?: string
  cnOrder?: number
  isActived?: number
}

export type Post = PostInput & { id: number | string }
