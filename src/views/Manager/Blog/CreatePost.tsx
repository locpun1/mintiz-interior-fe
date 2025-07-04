// src/views/Manager/Blog/CreatePost.tsx
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import Page from '@/components/Page';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUpload from './components/ImageUpload';
import useNotification from '@/hooks/useNotification';
import Editor from '@/components/Editor';
import InputText from '@/components/InputText';
import Button from '@/components/Button/Button';
import { useAppSelector } from '@/store';
import dayjs, { Dayjs } from 'dayjs';
import { createPost, uploadPostImage } from '@/services/post-service';

interface FormDataState {
  category: string;
  time: Dayjs | null;
  title: string;
  content: string;
  authorName: string;
}

type FormErrors = {
  [K in keyof FormDataState]?: string;
};

const CreatePostPage: FC = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { profile } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormDataState>({
    category: '',
    time: dayjs(),
    title: '',
    content: '',
    authorName: profile?.fullName || '', 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    setImageFile(file);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.category.trim()) newErrors.category = 'Vui lòng nhập thể loại.';
    if (!formData.time) newErrors.time = 'Vui lòng chọn thời gian.';
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống.';
    if (!formData.content.trim() || formData.content === '<p><br></p>') newErrors.content = 'Nội dung không được để trống.';
    if (!imageFile) {
      notify({ severity: 'error', message: 'Vui lòng tải lên hình ảnh.' });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!imageFile;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; 
    }

    setIsSubmitting(true);
    try {
      const uploadResponse = await uploadPostImage(imageFile!);
      if (!uploadResponse?.success || !uploadResponse.data?.imageUrl) {
        throw new Error('Upload ảnh thất bại hoặc không nhận được URL ảnh.');
      }

      const payload = {
        ...formData,
        time: formData.time ? formData.time.toISOString() : '',
        imageUrl: uploadResponse.data.imageUrl,
      };

      await createPost(payload);

      notify({ severity: 'success', message: 'Tạo bài viết thành công, đang chờ duyệt!' });
      navigate(-1);
    } catch (error: any) {
      notify({ severity: 'error', message: error.message || 'Tạo bài viết thất bại' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Tạo bài viết mới">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Tạo bài đăng
        </Typography>
      </Stack>

      <Box>
        <Card variant="outlined" sx={{ borderRadius: 4, p: 3 }}>
          <CardContent>
            <Grid container spacing={2} >
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Thể loại</Typography>
                <InputText
                  name="category"
                  type="text"
                  placeholder="Thể loại"
                  value={formData.category}
                  onChange={handleInputChange}
                  error={!!errors.category}
                  helperText={errors.category}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Thời gian</Typography>
                <InputText
                  name="time"
                  type="date"
                  placeholder="Chọn thời gian"
                  value={formData.time} 
                  onChange={handleInputChange}
                  error={!!errors.time}
                  helperText={errors.time}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={700}>Tiêu đề bài viết</Typography>
                <InputText
                  name="title"
                  type="text"
                  placeholder="Nhập thông tin"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <ImageUpload onFileSelect={handleFileSelect} />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight={700}>Nội dung bài viết</Typography>
                <Editor
                  value={formData.content}
                  onChange={handleContentChange}
                />
                {errors.content && (<Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.content}</Typography>)}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight={700}>Người viết bài</Typography>
                <InputText
                  name="authorName"
                  type="text"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="Tên người viết"
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button handleFunt={handleSubmit} customVariant="primary" backgroundColor='#1C1A1B' width={147} borderRadius='16px' disabled={isSubmitting}>
            Hoàn thành
          </Button>
          <Button handleFunt={() => navigate(-1)} customVariant="secondary" border='1px solid #1C1A1B' fontColor=' #1C1A1B' width={147} borderRadius='16px' >
            Đóng
          </Button>
        </Stack>
      </Box>
    </Page>
  );
};

export default CreatePostPage;