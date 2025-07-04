// src/components/Editor.tsx
import { FC } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import theme "snow"
import { Box, styled, useTheme } from '@mui/material';

// Custom styled component để tùy chỉnh giao diện của editor
const EditorContainer = styled(Box)(({ theme }) => ({
  '.ql-editor': {
    minHeight: '200px', // Đặt chiều cao tối thiểu cho vùng soạn thảo
    fontSize: '1rem',
  },
  '.ql-toolbar': {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    border: `1px solid ${theme.palette.divider}`,
    borderBottom: 'none',
  },
  '.ql-container': {
    borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
    border: `1px solid ${theme.palette.divider}`,
  },
}));


interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Editor: FC<EditorProps> = ({ value, onChange, placeholder }) => {
  const theme = useTheme();

  // Cấu hình các module cho toolbar của editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'], // Cho phép chèn link, ảnh, video
      ['clean'] // Nút xóa định dạng
    ],
  };
  
  return (
    <EditorContainer>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Bắt đầu viết nội dung ở đây...'}
      />
    </EditorContainer>
  );
};

export default Editor;