import { Box, Button, Card, CardContent, CardMedia, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import TabsViewSwitcher from './components/TabsViewSwitcher';
import { useCallback, useEffect, useState } from 'react';
import Grid from "@mui/material/Grid2";
import { CATEGORY_LABELS, CategoryNews } from '@/constants/status';
import ContentNewDetail from './components/ContentNewDetail';
import { ArrowRightAlt } from '@mui/icons-material';
import { IPost } from '@/types/post';
import { getPostsPublic } from '@/services/post-service';
import dayjs from 'dayjs';
import { getPathImage } from '@/utils/url';
import { getFormatText } from '@/utils/labelEnToVi';
import CustomPagination from '@/components/Pagination/CustomPagination';


export type CategoryType = 'Tất cả' | 'Sự kiện' | 'Kiến trúc' | 'Đời sống' | 'Công nghệ';

export interface ViewModeProps{
    id: string | number,
    label: string,
    value: CategoryType,
}

const DataViewMode: ViewModeProps[] = [
    {
        id: 1,
        label: 'Tất cả',
        value: 'Tất cả',

    },
    {
        id: 2,
        label: 'Sự kiện',
        value: 'Sự kiện',
    },
    {
        id: 3,
        label: 'Kiến trúc',
        value: 'Kiến trúc',
    },
    {
        id: 4,
        label: 'Đời sống',
        value: 'Đời sống',
    },
    {
        id: 5,
        label: 'Công nghệ',
        value: 'Công nghệ',
    },
]

export interface NewsListProps{
    id: number,
    category: string,
    date: string,
    title: string,
    description: string,
    image: string
}

export const getCategoryLabel = (category: CategoryNews | null | undefined): string => {
    if(!category) return "TẤT CẢ";
    return CATEGORY_LABELS[category] || category;
}

const News = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Tất cả');
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);
  const [newContent, setNewContent] = useState<IPost | null>(null);
  const [news, setNews] = useState<IPost[]>([]);
  const [page, setPage] = useState<number>(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  
  const getNews = useCallback(async(currentPage: number, currentSize: number, category?: string) => {
    const res = await getPostsPublic(currentPage, currentSize, category);
    setNews(res.posts || [])
    setTotal(res.totalPosts || 0);
  },[])

  const handleActiveCategory = (category: CategoryType) => {
    setActiveCategory(category);
    setPage(0);
  }

  useEffect(() => {
      if(activeCategory){
        
        getNews(page, rowsPerPage, activeCategory)
      }else{
        getNews(page, rowsPerPage)
      }
  }, [page, rowsPerPage, activeCategory])
  

  const handleToggleExpand = (item: IPost) => {
    setExpanded((prev) => !prev);
    setNewContent(item)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <Box sx={{ bgcolor: '#1C1A1B'}}>
      {!expanded && (
        <Box 
          sx={{ 
            color: 'white',
            px: { xs: 2, md: 6 },
            py: { xs: 4, md: 6 },
            textAlign: 'left',
          }}
        >
          <Typography variant='h5' fontWeight={700} textAlign='center' mb={1}>Tin tức</Typography>
          <Typography variant='body1' textAlign='center' mb={5}>Trang chủ/Tin tức</Typography>
          {mdUp ? (
            <Stack
              direction='column'
              spacing={1}
              sx={{
                mb: 2,
                width: '100%'
              }}
            >
              {DataViewMode.map((category, index) => (
                <Box
                  key={index}
                  onClick={() => category.value && handleActiveCategory(category.value)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    textAlign: 'left',
                    bgcolor: activeCategory === category.value ? 'white' : 'transparent',
                    color: activeCategory === category.value ? 'black' : 'white',
                    fontWeight: activeCategory === category.value ? 700 : 400,
                    border: '1px solid white',
                    transition: '0.3s',
                    "&:hover": {
                      bgcolor: activeCategory === category.value ? "white" : 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {category.label}
                </Box>
              ))}
            </Stack>
          ) : (
            <TabsViewSwitcher DataViewMode={DataViewMode} viewMode={activeCategory} onChange={setActiveCategory}/>
        )}
          {/* News Cards */}
          <Grid container spacing={3}>
            {news.map((item, index) => {
              const formatted = dayjs(item.updatedAt).format('MMM DD,YYYY')
              return(
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3}} key={item.id}>
                  <Card sx={{ bgcolor: '#1C1A1B', color: 'white'}}>
                    <CardMedia
                      component='img'
                      image={getPathImage(item.imageUrl)}
                      alt={item.title}
                      sx={{
                          objectFit: 'fill',
                          backgroundColor: '#f5f5f5',
                          height: "250px",
                          width:"100%",
                      }}
                    />
                    <CardContent>
                      <Box display='flex' justifyContent='space-between'>
                        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                          {getCategoryLabel(item.category)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                          {formatted}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" 
                        sx={{ 
                          mt: 1, opacity: 0.8, 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                        }}
                      >
                        {getFormatText(item.content)}
                      </Typography>
                      <Button
                        onClick={() => item && handleToggleExpand(item)}
                        variant="text"
                        sx={{ 
                          mt: 1, color: "white", fontWeight: 500, fontSize: '13px',
                          textDecoration: 'underline',
                          '&:hover': { textDecoration: 'underline', textDecorationColor: '#fff', bgcolor: '#1C1A1B'} 
                        }}
                        endIcon={<ArrowRightAlt/>}
                      >
                        Xem thêm
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
          <Box display='flex' justifyContent='center'>
            <CustomPagination
              page={page}
              count={total}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>
      )}
      {expanded && newContent && (
        <ContentNewDetail
          newContent={newContent}
          handleToggle={() => setExpanded(false)}
        />
      )}
    </Box>
  );
};

export default News;
