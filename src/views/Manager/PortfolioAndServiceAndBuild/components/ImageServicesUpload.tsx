// src/views/Manager/Blog/components/ImageUpload.tsx
import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDropzone } from 'react-dropzone';
import { getPathImage } from '@/utils/url';

const DropzoneContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  border: '1px dashed #1C1A1B',
  transition: theme.transitions.create('border-color'),
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface ImageServicesUploadProps {
  onFileSelect: (file: File) => void;
  resetCount: number;
  imageService: string | null
}

const ImageServicesUpload: FC<ImageServicesUploadProps> = ({ onFileSelect, resetCount, imageService }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if(resetCount){
      setPreview(null)
    }
  },[resetCount])

  useEffect(() => {
    if(imageService){
      const image = getPathImage(imageService)
      setPreview(image)
    }
  },[imageService])

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
          sx={{ height: 180, width: '100%', objectFit: 'fill', borderRadius: 2 }}
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

export default ImageServicesUpload;