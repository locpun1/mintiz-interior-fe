// src/views/Manager/Blog/components/BlogToolbar.tsx
import { FC, useState } from 'react';
import { Box, TextField, InputAdornment, Button, Stack, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';

type StatusFilter = 'pending' | 'approved' | 'rejected';

interface BlogToolbarProps {
  onFilterChange: (status: StatusFilter) => void;
  onSearch: (searchTerm: string) => void;
}

const BlogToolbar: FC<BlogToolbarProps> = ({ onFilterChange, onSearch }) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('pending');

  const handleFilterClick = (status: StatusFilter) => {
    setActiveFilter(status);
    onFilterChange(status);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm bài viết..."
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {}
        }}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
        <Button endIcon={<FilterListIcon />} sx={{
          backgroundColor: '#ffffff',
          color: '#1C1A1B',
          fontSize: '16px',
          fontWeight: '700',
          borderBottom: '4px solid #1C1A1B',
          borderRadius: '0px'
        }}>Bộ lọc:</Button>
        <Chip
          label="Bài viết chưa duyệt"
          icon={<HourglassEmptyIcon />}
          variant={activeFilter === 'pending' ? 'filled' : 'outlined'}
          sx={{
            padding: '8px 20px',
            border: '1px solid #1C1A1B',
            fontSize: '16px',
            fontWeight: '700',
            color: '#1C1A1B',
            height: '100%',
            ...(activeFilter === 'pending' && {
              border: 'none',
              borderBottom: '4px solid #1C1A1B',
              borderRadius: '0px'
            })
          }}
          onClick={() => handleFilterClick('pending')}
        />
        <Chip
          label="Bài viết đã duyệt"
          icon={<CheckCircleOutlineIcon />}
          variant={activeFilter === 'approved' ? 'filled' : 'outlined'}
          sx={{
            padding: '8px 20px',
            border: '1px solid #1C1A1B',
            fontSize: '16px',
            fontWeight: '700',
            color: '#1C1A1B',
            height: '100%',
            ...(activeFilter === 'approved' && {
              border: 'none',
              borderBottom: '4px solid #1C1A1B',
              borderRadius: '0px'
            })
          }}
          onClick={() => handleFilterClick('approved')}
        />
        <Chip
          label="Bị từ chối"
          icon={<DoNotDisturbOnOutlinedIcon />}
          variant={activeFilter === 'rejected' ? 'filled' : 'outlined'}
          sx={{
            padding: '8px 20px',
            border: '1px solid #1C1A1B',
            fontSize: '16px',
            fontWeight: '700',
            color: '#1C1A1B',
            height: '100%',
            ...(activeFilter === 'rejected' && {
              border: 'none',
              borderBottom: '4px solid #1C1A1B',
              borderRadius: '0px'
            })
          }}
          onClick={() => handleFilterClick('rejected')}
        />
      </Stack>
    </Box>
  );
};

export default BlogToolbar;