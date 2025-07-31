// src/views/Manager/Blog/components/BlogPostCard.tsx
import { FC, MouseEvent } from 'react';
import { Box, Card, CardActions, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import type { IPost } from '@/types/post';
import Button from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '@/types/user';
import cardfuni_11 from '@/assets/images/users/11.png';



const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

interface BlogPostCardProps {
  post: IPost;
  userRole?: IUser['role'];
  onApprove?: (postId: number) => void;
  onReject?: (postId: number) => void;
  onPublish?: (postId: number, currentState: boolean) => void;
  onEdit?: (postId: number) => void;
}

const getStatusInfo = (status: 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'approved':
      return { label: 'Phê duyệt thành công', color: 'success' as const };
    case 'rejected':
      return { label: 'Phê duyệt thất bại', color: 'error' as const };
    case 'pending':
    default:
      return { label: 'Đang chờ phê duyệt', color: 'warning' as const };
  }
};

const BlogPostCard: FC<BlogPostCardProps> = ({ post, onApprove, onReject, onPublish, onEdit }) => {
  const navigate = useNavigate();
  const plainTextContent = stripHtml(post.content);

  const statusInfo = getStatusInfo(post.status);

  const handleNavigate = () => {
    navigate(`/manage/blog/${post.id}`);
  };

  const handleActionClick = (e: MouseEvent<HTMLButtonElement>, action: 'approve' | 'reject' | 'publish' | 'edit') => {
    e.stopPropagation();
    switch (action) {
      case 'approve': onApprove?.(post.id); break;
      case 'reject': onReject?.(post.id); break;
      case 'publish': onPublish?.(post.id, post.isPublished); break;
      case 'edit': onEdit?.(post.id); break;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: '360px',
        padding: '12px 20px',
        border: '0.5px solid #D9D5D4',
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer'
        },
        position: 'relative',
      }}>
      <Chip
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          fontWeight: 600,
          width: '50%'
        }}
      />
      <Box onClick={handleNavigate}>
        <CardMedia
          component="img"
          sx={{
            objectFit: 'cover',
            height: "169px",
            mt: 5
          }}
          image={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}` || cardfuni_11}
          alt={post.title}
        />
        <CardContent sx={{
          flexGrow: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography sx={{ fontSize: '16px', color: '#171717', maxWidth: '360px' }} fontWeight={700} noWrap>
            {post.title}
          </Typography>
          <Typography sx={{
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '50px',
            maxWidth: '360px',
          }}>
            {plainTextContent}
          </Typography>
        </CardContent>
      </Box>
      <CardActions sx={{ justifyContent: 'space-around', p: 1.5, pt: 0 }}>
        {onApprove && post.status === 'pending' && (
          <Button customVariant='outline' fontColor='#1C1A1B' backgroundColor='white' border='solid 1px #1C1A1B' borderRadius='20px' width='120px' height='35px' handleFunt={(e) => handleActionClick(e, 'approve')}>Chấp nhận</Button>
        )}
        {onReject && post.status === 'pending' && (
          <Button customVariant='outline' fontColor='#1C1A1B' backgroundColor='white' border='solid 1px #1C1A1B' borderRadius='20px' width='120px' height='35px' handleFunt={(e) => handleActionClick(e, 'reject')}>Từ chối</Button>
        )}
        {onPublish && post.status === 'approved' && (
          <Button
            customVariant='outline' fontColor='#1C1A1B' backgroundColor='white' border='solid 1px #1C1A1B' borderRadius='20px' width='100%' height='35px'
            handleFunt={(e) => handleActionClick(e, 'publish')}
          >
            {post.isPublished ? 'Hủy Đăng' : 'Đăng Tải'}
          </Button>
        )}
        {onEdit && (post.status === 'rejected' || post.status === 'pending') && (
          <Button
            customVariant='outline' fontColor='#1C1A1B' backgroundColor='white' border='solid 1px #1C1A1B' borderRadius='20px' width='100%' height='35px'
            handleFunt={(e) => handleActionClick(e, 'edit')}
          >
            Chỉnh Sửa
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BlogPostCard;