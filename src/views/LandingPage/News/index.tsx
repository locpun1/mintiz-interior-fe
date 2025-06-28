import { Box, Button, Card, CardContent, CardMedia, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import TabsViewSwitcher from './components/TabsViewSwitcher';
import { useState } from 'react';
import homeImage from "@/assets/images/users/home-image.png";
import Grid from "@mui/material/Grid2";
import { CATEGORY_LABELS, CategoryNews } from '@/constants/status';
import ContentNewDetail from './components/ContentNewDetail';
import { ArrowRightAlt } from '@mui/icons-material';

export type CategoryType = 'all' | 'event' | 'architecture' | 'life' | 'information-tech';

export interface ViewModeProps{
    id: string | number,
    label: string,
    value: CategoryType,
}

const DataViewMode: ViewModeProps[] = [
    {
        id: 1,
        label: 'Tất cả',
        value: 'all'
    },
    {
        id: 2,
        label: 'Sự kiện',
        value: 'event'
    },
    {
        id: 3,
        label: 'Kiến trúc',
        value: 'architecture'
    },
    {
        id: 4,
        label: 'Đời sống',
        value: 'life'
    },
    {
        id: 5,
        label: 'Công nghệ',
        value: 'information-tech'
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

const newsList : NewsListProps[] = Array.from({length: 6}).map((_, i) => ({
  id: i,
  category: ['event', 'architecture', 'life', 'information-tech'][i % 4],
  date: 'Th06 26,2025',
  title: 'Job position: Barista wanted',
  description: "Would you like to join our team? We offer amazing opportunity and great atmosphere.",
  image: homeImage,
}))

export const getCategoryLabel = (category: CategoryNews | null | undefined): string => {
    if(!category) return "TẤT CẢ";
    return CATEGORY_LABELS[category] || category;
}

const News = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.down('md'));
  const filterNews = activeCategory === 'all' ? newsList : newsList.filter((item) => item.category === activeCategory)
  const [expanded, setExpanded] = useState(false);
  const [newContent, setNewContent] = useState<NewsListProps | null>(null);

  
  const handleToggleExpand = (item: NewsListProps) => {
    setExpanded((prev) => !prev);
    setNewContent(item)
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
                  onClick={() => setActiveCategory(category.value)}
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
            {filterNews.map((item, index) => {
              return(
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3}} key={item.id}>
                  <Card sx={{ bgcolor: '#1C1A1B', color: 'white'}}>
                    <CardMedia
                      component='img'
                      image={item.image}
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
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {getCategoryLabel(item.category)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {item.date}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                        {item.description}
                      </Typography>
                      <Button
                        onClick={() => item && handleToggleExpand(item)}
                        variant="text"
                        sx={{ 
                          mt: 1, color: "white", fontWeight: 500,
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
