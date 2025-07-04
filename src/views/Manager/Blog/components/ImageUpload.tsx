// src/views/Manager/Blog/components/ImageUpload.tsx
import { FC, useCallback, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDropzone } from 'react-dropzone';

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
}

const ImageUpload: FC<ImageUploadProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    maxFiles: 1,
  });

  return (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      {preview ? (
        <Box
          component="img"
          src={preview}
          alt="Preview"
          sx={{ maxHeight: 200, maxWidth: '100%', borderRadius: 2 }}
        />
      ) : (
        <>
          <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6">Thêm hình ảnh</Typography>
          <Typography variant="body2" color="text.secondary">
            Kéo và thả hoặc nhấn để chọn file
          </Typography>
        </>
      )}
    </DropzoneContainer>
  );
};

export default ImageUpload;