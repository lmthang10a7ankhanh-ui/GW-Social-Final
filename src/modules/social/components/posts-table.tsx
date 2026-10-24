import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table'
import type { Post } from '../types/post'

export function PostsTable({
  posts,
  busy,
  onEdit,
  onDelete,
}: {
  posts: Post[]
  busy: boolean
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}) {
  return (
    <div className="flex-1 overflow-auto border-b">
      <Table
        containerClassName="overflow-visible"
        className="w-full min-w-[700px] table-fixed border-collapse text-left [&_td]:px-1.5 [&_td]:py-1 [&_th]:px-1.5 [&_th]:py-1 [&_th]:font-bold"
      >
        <colgroup>
          <col className="w-12" />
          <col className="w-[30%]" />
          <col />
          <col className="w-24" />
          <col className="w-24" />
          <col className="w-24" />
        </colgroup>
        <TableHeader className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900">
          <TableRow className="[&_th]:h-8">
            <TableHead className="text-center">#</TableHead>
            <TableHead>Tên kênh</TableHead>
            <TableHead>Đường dẫn URL</TableHead>
            <TableHead className="text-center">Thứ tự</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Không có kênh phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {index + 1}
                </TableCell>
                <TableCell className="wrap-anywhere whitespace-normal font-medium text-zinc-900 dark:text-zinc-100">
                  {post.cnName}
                </TableCell>
                <TableCell className="wrap-anywhere whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                  {post.cnUrl}
                </TableCell>
                <TableCell className="text-center tabular-nums text-zinc-700 dark:text-zinc-300">
                  {post.cnOrder ?? 1}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      post.isActived === 1
                        ? 'inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'inline-flex rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }
                  >
                    {post.isActived === 1 ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={`Sửa ${post.cnName}`}
                      className="text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950/50"
                      onClick={() => onEdit(post)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={`Xóa ${post.cnName}`}
                      className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/50"
                      onClick={() => onDelete(post)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
