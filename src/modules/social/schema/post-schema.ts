import * as yup from 'yup'

export const postSchema = yup
  .object({
    cnName: yup
      .string()
      .trim()
      .required('Vui lòng nhập tên kênh.')
      .max(120, 'Tên kênh tối đa 120 ký tự.'),
    cnUrl: yup
      .string()
      .trim()
      .required('Vui lòng nhập đường dẫn URL.')
      .max(500, 'Đường dẫn tối đa 500 ký tự.'),
    cnIcon: yup
      .string()
      .transform((value) => (value === null ? '' : value))
      .optional(),
    cnStyle: yup
      .string()
      .transform((value) => (value === null ? '' : value))
      .optional(),
    cnOrder: yup
      .number()
      .typeError('Thứ tự phải là số.')
      .transform((value) => (isNaN(value) ? 0 : value))
      .optional(),
    isActived: yup
      .number()
      .transform((value) => (isNaN(value) ? 1 : value))
      .optional(),
  })
  .required()
