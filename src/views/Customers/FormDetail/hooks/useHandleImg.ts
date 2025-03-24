import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FileWithPreview } from '@/components/FileUpload';

import useNotification from '@/hooks/useNotification';
import { UploadImage } from '@/types/common';
import { CreateCustomerForm } from '@/types/customer-types';

const useHandleImg = (form: UseFormReturn<CreateCustomerForm>) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [existingImages, setExistingImages] = useState<UploadImage[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [prevImageCount, setPrevImageCount] = useState(existingImages.length);
  const maxFiles = 5;
  const { t } = useTranslation('customer');
  const notify = useNotification();

  useEffect(() => {
    const hasChanges = files.length > 0 || existingImages.length !== prevImageCount;
    setIsDirty(form.formState.isDirty || hasChanges);
    setPrevImageCount(existingImages.length);
  }, [files, existingImages, form.formState.isDirty]);

  const handleDrop = (acceptedFiles: File[]) => {
    const totalFiles = acceptedFiles.length + existingImages.length + files.length;
    if (totalFiles > maxFiles) {
      notify({
        message: t('max_files_exceeded', { maxFiles }),
        severity: 'error',
      });
      return;
    }
    setFiles((previousFile) => [
      ...previousFile,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    ]);
    setIsDirty(true);
  };

  const handleDelete = (fileToDelete: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
    setIsDirty(true);
  };

  const handleDeleteExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setIsDirty(true);
  };

  return {
    files,
    existingImages,
    isDirty,
    handleDrop,
    handleDelete,
    handleDeleteExistingImage,
  };
};

export default useHandleImg;
