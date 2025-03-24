import React, { useCallback } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';

import useNotification from '@/hooks/useNotification';

export interface FileWithPreview extends File {
  preview: string;
}
interface DropzoneProps {
  accept?: Accept;
  files: FileWithPreview[];
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  onDrop: (acceptedFiles: File[]) => void;
  onDelete: (file: FileWithPreview) => void;
  showPreview?: boolean;
  isShowText?: boolean;
}

const FileUpload: React.FC<DropzoneProps> = ({
  accept = {
    'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp'],
    'text/csv': ['.csv'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/pdf': ['.pdf'],
  },
  files,
  maxFiles = 5,
  maxSize = 5242880,
  multiple = true,
  onDrop,
  onDelete,
  showPreview = true,
  isShowText = true,
}) => {
  const notify = useNotification();
  const { t } = useTranslation('common');

  const handleRejectedFiles = (filesReject: FileRejection[]) => {
    if (filesReject.length + files.length > maxFiles) {
      notify({
        error: t('files.max_files_exceeded', { maxFiles: maxFiles }),
        severity: 'error',
      });
      return;
    }

    if (filesReject.length > 0) {
      filesReject.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            notify({
              message: t('files.file_too_large', {
                fileName: file.name,
                maxSize: (maxSize / 1000000).toFixed(2),
              }),
              severity: 'error',
            });
          }
          if (error.code === 'file-invalid-type') {
            notify({
              message: t('files.file_not_accepted', { fileName: file.name }),
              severity: 'error',
            });
          }
        });
      });
      return;
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + files.length > maxFiles) {
        notify({
          message: t('files.max_files_exceeded', { maxFiles: maxFiles }),
          severity: 'error',
        });
        return;
      }

      const newFiles = acceptedFiles.filter((newFile) => {
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size,
        );

        if (isDuplicate) {
          notify({
            message: t('files.duplicate_file', { fileName: newFile.name }),
            severity: 'warning',
          });
          return false;
        }
        return true;
      });

      onDrop(newFiles);
    },
    [files, onDrop, maxFiles, notify, t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    onDropRejected: handleRejectedFiles,
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed #ccc',
          padding: '18px',
          textAlign: 'center',
          borderRadius: '10px',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fff',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <FileUploadOutlinedIcon fontSize='large' />
        {isShowText && (
          <>
            <Typography sx={{ cursor: 'pointer' }}>{t('files.drag_and_drop')}</Typography>
            {maxFiles && <em> {t('files.max_files', { maxFiles })}</em>}
          </>
        )}
      </Box>
      {files.length > 0 && showPreview && (
        <ImageList
          sx={{
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr)) !important',
          }}
          cols={4}
        >
          {files.map((file: FileWithPreview) => (
            <ImageListItem
              key={file.preview}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1/1',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  '& .delete-btn': {
                    opacity: 1,
                  },
                },
              }}
            >
              <img
                src={file.preview}
                alt='ID Document'
                loading='lazy'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                className='delete-btn'
                size='small'
                onClick={() => onDelete(file)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'white',
                  color: '#666',
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  padding: '4px',
                  width: '24px',
                  height: '24px',
                  minWidth: '24px',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'error.main',
                    transform: 'scale(1.1)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '16px',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default FileUpload;
