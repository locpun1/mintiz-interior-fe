// src/schemas/post-schema.ts
import * as yup from 'yup';

export const createPostSchema = yup.object().shape({
  category: yup.string().required('Vui lòng nhập thể loại'),
  time: yup.string().required('Vui lòng chọn thời gian'),
  title: yup.string().required('Tiêu đề không được để trống'),
  content: yup.string().required('Nội dung không được để trống'),
  authorName: yup.string().required('Tên người viết không được để trống'),
  // Validation cho ảnh có thể phức tạp hơn, tạm thời bỏ qua
});