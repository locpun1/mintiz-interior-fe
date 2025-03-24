import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, ImageList, ImageListItem } from '@mui/material';
import useGetOptions from './hooks/useGetOptions';
import { useBaseColumns } from '@/components/DynamicFormTable/BaseColumns';
import FileUpload, { FileWithPreview } from '@/components/FileUpload';

import { CreateCustomerForm, CustomerIdentityType } from '@/types/customer-types';

interface Props {
  onDelete: (index: number) => void;
  files: FileWithPreview[];
  handleDrop: (acceptedFiles: File[]) => void;
  handleDelete: (file: FileWithPreview) => void;
  form: UseFormReturn<CreateCustomerForm>;
}

const useIdentityTableColumns = ({ onDelete, files, handleDrop, handleDelete, form }: Props) => {
  const { t } = useTranslation('customer');
  const { identityTypeOptions } = useGetOptions();
  const { createBaseSelectColumn, createBaseTextColumn, actionColumn } = useBaseColumns<
    CustomerIdentityType,
    CreateCustomerForm
  >({
    onDelete: ({ row }) => onDelete(row.index),
    onUpdate: () => {},
    key: 'identities',
    form,
  });

  const columns = useMemo(
    () => [
      createBaseSelectColumn(
        'identityType',
        t('identity_type'),
        identityTypeOptions.map((option) => ({
          value: option.value,
          label: option.label,
        })),
        200,
      ),
      createBaseTextColumn('identityNumber', t('identity_number'), 200),
      {
        id: 'files',
        size: 50,
        header: () => t('identity_image_upload'),
        cell: () => (
          <FileUpload
            onDrop={handleDrop}
            onDelete={handleDelete}
            files={files}
            showPreview={false}
            isShowText={false}
            maxFiles={2}
            accept={{
              'image/jpeg': [],
              'image/jpg': [],
              'image/png': [],
              'image/webp': [],
            }}
          />
        ),
      },
      {
        id: 'image-preview',
        size: 300,
        header: () => t('identity_image'),
        cell: ({ row }: { row: Row<CustomerIdentityType> }) => (
          <ImageCell files={row.original.files || []} onDelete={handleDelete} />
        ),
      },
      actionColumn,
    ],
    [t, identityTypeOptions],
  );

  return { columns };
};

const ImageCell = ({
  files,
  onDelete,
}: {
  files: FileWithPreview[];
  onDelete: (file: FileWithPreview) => void;
}) => {
  return (
    <>
      {files.length > 0 && (
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
                  width: '12px',
                  height: '12px',
                  minWidth: '12px',
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
    </>
  );
};

export default useIdentityTableColumns;
