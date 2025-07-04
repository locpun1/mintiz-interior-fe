// src/views/Manager/Blog/components/CreatePostCard.tsx
import { FC } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Card, CardActionArea, Typography, Box } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { ROUTE_PATH } from '@/constants/routes'; 

const CreatePostCard: FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    const createPath = generatePath(`/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}/${ROUTE_PATH.BLOG_CREATE}`);
    navigate(createPath);
  };

  return (
    <Card sx={{
      height: '100%',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      borderRadius: 4,
    }}>
      <CardActionArea
        onClick={handleCreate}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          padding:'12px',
          border:'1px dashed #646263',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            backgroundColor: 'action.hover',
          }
        }}
      >
        <AddBoxIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography fontWeight={600}>Tạo bài đăng</Typography>
      </CardActionArea>
    </Card>
  );
};

export default CreatePostCard;