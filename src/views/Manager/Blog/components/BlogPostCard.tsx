// src/views/Manager/Blog/components/BlogPostCard.tsx
import { FC } from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import type { IPost } from '@/types/post';
import Button from '@/components/Button/Button';

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

interface BlogPostCardProps {
  post: IPost;
  onApprove: (postId: number) => void;
  onReject: (postId: number) => void;
}

const BlogPostCard: FC<BlogPostCardProps> = ({ post, onApprove, onReject }) => {

  const plainTextContent = stripHtml(post.content);

  return (
    <Card sx={{
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
      }
    }}>
      <CardMedia
        component="img"
        sx={{
          objectFit: 'cover',
          height: "169px",
        }}
        image={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}` || `https://source.unsplash.com/random/400x250?interior,${post.id}`}
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
      <CardActions sx={{ justifyContent: 'space-around', p: 1.5, pt: 0 }}>
        <Button
          customVariant="secondary"
          width={135}
          padding='8px 20px'
          borderRadius='16px'
          backgroundColor='#FFFFFF'
          border='2px solid #1C1A1B'
          fontColor='#1C1A1B'
          fontSize='16px'
          fontWeight='500'
          handleFunt={() => onApprove(post.id)}
        >
          Chấp nhận
        </Button>
        <Button
          customVariant="secondary"
          width={135}
          padding='8px 20px'
          borderRadius='16px'
          backgroundColor='#FFFFFF'
          border='2px solid #1C1A1B'
          fontColor='#1C1A1B'
          fontSize='16px'
          fontWeight='500'
          handleFunt={() => onReject(post.id)}
        >
          Từ chối
        </Button>
      </CardActions>
    </Card>
  );
};

export default BlogPostCard;