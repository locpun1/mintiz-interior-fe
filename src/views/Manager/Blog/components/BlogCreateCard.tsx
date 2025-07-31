import { IPost } from "@/types/post";
import { getFormatText } from "@/utils/labelEnToVi";
import { getPathImage } from "@/utils/url";
import { Button, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface BlogCreateCardProps{
    blog: IPost;
}

const BlogCreateCard: FC<BlogCreateCardProps> = ({ blog }) => {
    const navigate = useNavigate();

    const handleNavigate = (id: number | string) => {
        navigate(`/manage/blog/${id}`);
    };

    return(
        <Card
            sx={{
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxWidth: '360px',
                padding: '10px 15px',
                border: '0.5px solid #D9D5D4',
                boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer'
                },
            }}
        >
            <CardMedia
                component='img'
                image={getPathImage(blog.imageUrl)}
                alt={blog.title}
                sx={{
                    objectFit: 'fill',
                    backgroundColor: '#f5f5f5',
                    height: "180px",
                    width:"100%",
                }}
            />
                <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {blog.title}
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
                        {getFormatText(blog.content)}
                    </Typography>
                    <Stack display='flex' justifyContent='end'>
                        <Button
                            onClick={() => blog.id && handleNavigate(blog.id)}
                            variant="text"
                            sx={{ 
                                color: "black", fontWeight: 500, fontSize: '13px',
                                textDecoration: 'underline',
                                '&:hover': { textDecoration: 'underline', textDecorationColor: '#000', bgcolor: 'white'} 
                            }}
                        >
                            Xem thêm
                        </Button>
                    </Stack>
                </CardContent>
        </Card>
    )
}

export default BlogCreateCard;