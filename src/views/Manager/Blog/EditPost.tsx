import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Card, CardContent, Grid, IconButton, Stack, Typography, CircularProgress } from '@mui/material';
import Page from '@/components/Page';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageUpload from './components/ImageUpload';
import useNotification from '@/hooks/useNotification';
import Editor from '@/components/Editor';
import InputText from '@/components/InputText';
import Button from '@/components/Button/Button';
import { useAppSelector } from '@/store';
import dayjs, { Dayjs } from 'dayjs';
import { getPostById, updatePost, uploadPostImage } from '@/services/post-service';

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

const EditPostPage: FC = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { profile } = useAppSelector((state) => state.auth);
  const { postId } = useParams<{ postId: string }>();

  const [formData, setFormData] = useState<FormDataState>({
    category: '',
    time: null,
    title: '',
    content: '',
    authorName: profile?.fullName || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!postId) {
      notify({ severity: 'error', message: 'Không tìm thấy ID bài viết.' });
      navigate(-1);
      return;
    }

    const fetchPostData = async () => {
      try {
        setIsLoadingData(true);
        const response = await getPostById(Number(postId));
        const postData = response.data;

        if (postData) {
          setFormData({
            category: postData.category,
            time: dayjs(postData.createdAt),
            title: postData.title,
            content: postData.content,
            authorName: postData.author?.fullName || 'Không xác định',
          });
          setExistingImageUrl(postData.imageUrl);
        } else {
          throw new Error('Không nhận được dữ liệu bài viết từ API.');
        }
      } catch (error: any) {
        notify({ severity: 'error', message: error.message || 'Không thể tải dữ liệu bài viết.' });
        navigate(-1);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPostData();
  }, [postId, navigate, notify]);


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
    setExistingImageUrl(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.category.trim()) newErrors.category = 'Vui lòng nhập thể loại.';
    if (!formData.time) newErrors.time = 'Vui lòng chọn thời gian.';
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống.';
    if (!formData.content.trim() || formData.content === '<p><br></p>') newErrors.content = 'Nội dung không được để trống.';

    if (!imageFile && !existingImageUrl) {
      notify({ severity: 'error', message: 'Vui lòng tải lên hình ảnh.' });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = existingImageUrl;

      if (imageFile) {
        const uploadResponse = await uploadPostImage(imageFile);
        if (!uploadResponse?.success || !uploadResponse.data?.imageUrl) {
          throw new Error('Upload ảnh mới thất bại.');
        }
        imageUrl = uploadResponse.data.imageUrl;
      }

      const payload = {
        ...formData,
        time: formData.time ? formData.time.toISOString() : '',
        imageUrl: imageUrl,
      };

      await updatePost(Number(postId), payload);

      notify({ severity: 'success', message: 'Cập nhật bài viết thành công!' });
      navigate(-1);
    } catch (error: any) {
      notify({ severity: 'error', message: error.message || 'Cập nhật bài viết thất bại' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Page title="Chỉnh sửa bài viết">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Chỉnh sửa bài đăng
        </Typography>
      </Stack>

      <Box>
        <Card variant="outlined" sx={{ borderRadius: 4, p: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
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
                <ImageUpload
                  onFileSelect={handleFileSelect}
                  initialImage={existingImageUrl ? `${import.meta.env.VITE_API_BASE_URL}${existingImageUrl}` : undefined}
                />
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
            {/* === KẾT THÚC PHẦN HOÀN THIỆN === */}
          </CardContent>
        </Card>

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          {/* === PHẦN ĐÃ ĐƯỢC HOÀN THIỆN === */}
          <Button
            handleFunt={handleSubmit}
            customVariant="primary"
            backgroundColor='#1C1A1B'
            width={147}
            borderRadius='16px'
            disabled={isSubmitting}
          >
            Cập Nhật
          </Button>
          <Button
            handleFunt={() => navigate(-1)}
            customVariant="secondary"
            border='1px solid #1C1A1B'
            fontColor=' #1C1A1B'
            width={147}
            borderRadius='16px'
          >
            Đóng
          </Button>
        </Stack>
      </Box>
    </Page>
  );
};

export default EditPostPage;