import { useEffect, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertCircle, LoaderCircle, Save } from 'lucide-react'
import { FormModal } from '@/core/components/form-modal'
import { ShortcutKbd } from '@/core/components/shortcut-kbd'
import { shortcutAria, useShortcut } from '@/core/lib/use-shortcut'
import { postSchema } from '../schema/post-schema'
import type { Post, PostInput } from '../types/post'

function FormRow({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid gap-x-4 gap-y-1 sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="flex items-baseline justify-between gap-2 sm:block sm:pt-[8px]">
        <label htmlFor={htmlFor} className="text-[13px] leading-[18px] font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1 flex items-center gap-1 text-[12px] text-red-600">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  ) : null
}

const inputClass = (invalid: boolean) =>
  `h-[34px] w-full rounded-lg border bg-white px-3 text-[13px] text-slate-800 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
  }`

export function PostForm({
  open,
  post,
  busy,
  error,
  onClose,
  onSave,
}: {
  open: boolean
  post: Post | null
  busy: boolean
  error: string
  onClose: () => void
  onSave: (input: PostInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, submitCount },
  } = useForm<PostInput>({
    resolver: yupResolver(postSchema) as unknown as undefined,
    defaultValues: {
      cnName: '',
      cnUrl: '',
      cnIcon: '',
      cnStyle: '',
      cnOrder: 1, // Mặc định là 1 để thỏa mãn điều kiện lớn hơn 0 của C#
      isActived: 1,
    },
  })

  const isActived = useWatch({ control, name: 'isActived' })

  useEffect(() => {
    if (open) {
      reset(
        post
          ? {
              id: post.id, // Đảm bảo lấy ID của bản ghi đang sửa
              cnName: post.cnName,
              cnUrl: post.cnUrl,
              cnIcon: post.cnIcon || '',
              cnStyle: post.cnStyle || '',
              cnOrder: post.cnOrder ?? 1,
              isActived: post.isActived ?? 1,
            }
          : {
              cnName: '',
              cnUrl: '',
              cnIcon: '',
              cnStyle: '',
              cnOrder: 1,
              isActived: 1,
            },
      )
    }
  }, [open, post, reset])

  const close = () => {
    if (!busy) onClose()
  }

  const save = handleSubmit(async (values) => {
    if (!busy) {
      const payload = {
        ...values,
        cnOrder: !values.cnOrder || values.cnOrder <= 0 ? 1 : Number(values.cnOrder),
      }
      await onSave(payload as unknown as PostInput)
    }
  })

  useShortcut('cancel', close, { enabled: open })
  useShortcut('save', save, { enabled: open })

  return (
    <FormModal isOpen={open} busy={busy} onClose={close} labelledBy="post-form-title">
      <div className="flex max-h-[calc(100svh-2rem)] w-full flex-col rounded-xl bg-white shadow-xl sm:max-h-[calc(100svh-3rem)]">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <h3 id="post-form-title" className="text-[16px] font-semibold text-slate-900">
              {post ? 'Sửa kênh' : 'Thêm kênh'}
            </h3>
            {submitCount > 0 && Object.keys(errors).length > 0 && (
              <span aria-live="polite" className="flex items-center gap-1 text-[12px] text-red-600">
                <AlertCircle className="size-3.5" />
                {Object.keys(errors).length} lỗi cần kiểm tra
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={close}
              disabled={busy}
              aria-keyshortcuts={shortcutAria('cancel')}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
              <ShortcutKbd action="cancel" />
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              aria-keyshortcuts={shortcutAria('save')}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {busy ? 'Đang lưu…' : 'Lưu'}
              {!busy && <ShortcutKbd action="save" />}
            </button>
          </div>
        </header>

        {error && (
          <p role="alert" className="px-5 pt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form
          noValidate
          onSubmit={save}
          className="relative min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4"
        >
          <FormRow label="Tên kênh" htmlFor="post-cnName" required>
            <input
              id="post-cnName"
              autoComplete="off"
              placeholder="Nhập tên kênh"
              disabled={busy}
              {...register('cnName')}
              aria-invalid={!!errors.cnName}
              aria-describedby="post-cnName-error"
              className={inputClass(!!errors.cnName)}
            />
            <FieldError id="post-cnName-error" message={errors.cnName?.message} />
          </FormRow>

          <FormRow label="Đường dẫn URL" htmlFor="post-cnUrl" required>
            <input
              id="post-cnUrl"
              autoComplete="off"
              placeholder="Nhập đường dẫn URL"
              disabled={busy}
              {...register('cnUrl')}
              aria-invalid={!!errors.cnUrl}
              aria-describedby="post-cnUrl-error"
              className={inputClass(!!errors.cnUrl)}
            />
            <FieldError id="post-cnUrl-error" message={errors.cnUrl?.message} />
          </FormRow>

          <FormRow label="Icon" htmlFor="post-cnIcon">
            <input
              id="post-cnIcon"
              autoComplete="off"
              placeholder="Nhập tên Icon (nếu có)"
              disabled={busy}
              {...register('cnIcon')}
              className={inputClass(false)}
            />
          </FormRow>

          <FormRow label="Thứ tự" htmlFor="post-cnOrder" required>
            <input
              id="post-cnOrder"
              type="number"
              min="1"
              disabled={busy}
              {...register('cnOrder', { valueAsNumber: true })}
              className={inputClass(!!errors.cnOrder)}
            />
            <FieldError id="post-cnOrder-error" message={errors.cnOrder?.message} />
          </FormRow>

          <FormRow label="Trạng thái" htmlFor="post-isActived">
            <div className="flex items-center pt-1">
              <label
                htmlFor="post-isActived"
                className="relative inline-flex cursor-pointer items-center"
              >
                <input
                  type="checkbox"
                  id="post-isActived"
                  disabled={busy}
                  checked={isActived === 1}
                  {...register('isActived', {
                    setValueAs: (v) => (v ? 1 : 0),
                  })}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out peer-checked:bg-red-600 peer-disabled:opacity-50 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:content-[''] peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
                <span className="ml-2.5 text-[13px] font-medium text-slate-700">
                  {isActived === 1 ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </span>
              </label>
            </div>
          </FormRow>
        </form>
      </div>
    </FormModal>
  )
}
