// src/views/Manager/Blog/components/ImageUpload.tsx
import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, Stack, Typography, styled } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDropzone } from 'react-dropzone';
import useNotification from '@/hooks/useNotification';

const DropzoneContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  border: '1px dashed #1C1A1B',
  transition: theme.transitions.create('border-color'),
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  handleAddImage: () => void;
}

const ImageSlideUpload: FC<ImageUploadProps> = ({ onFileSelect, handleAddImage }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const notify = useNotification();
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if(!file) return;

    //Kiểm tra dung lượng file < 10MB
    if(file.size > 10 * 1024 * 1024){
      setError(`Ảnh quá lớn (${(file.size/ (1024 * 1024)).toFixed(2)} MB). Vui lòng chọn lại ảnh`);
      return;
    }

    //Kiểm tra kích thước ảnh
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      if(image.width < 4920 || image.height < 3260){
        setError(`Ảnh bạn chọn có kích thước ${image.width}x${image.height}. 
                    Phải ít nhất 4920x3260 để không bị vỡ khi hiển thị slide.`);
        URL.revokeObjectURL(image.src);
        setPreview(null)
        return;
      }

      // Nếu pass
      onFileSelect(file);
      setPreview(image.src)
    }
  }, [onFileSelect]);

  // Cleanup URL khi component bị hủy hoặc preview thay đổi
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    maxFiles: 1,
  });

  return (
    <Box display='flex' flexDirection='column'>
        <DropzoneContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6">Thêm hình ảnh</Typography>
            <Typography variant="body2" color="text.secondary">
                Kéo và thả hoặc nhấn để chọn file
            </Typography>
        </DropzoneContainer>
        {error && (
          <Box mt={2}>
            <Typography fontWeight={500} variant='body2'>{error}</Typography>
          </Box>
        )}
        {preview && (
            <Stack sx={{ mt: 2}} direction='column'>
              <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ maxHeight: 300, maxWidth: '100%', borderRadius: 2 }}
                />
              <Button
                fullWidth
                sx={{ mt: 2, bgcolor: '#1C1A1B' }}
                variant="contained"
                onClick={handleAddImage}
              >
                Xác nhận thêm
              </Button>
            </Stack>
        )}
    </Box>
  );
};

export default ImageSlideUpload;