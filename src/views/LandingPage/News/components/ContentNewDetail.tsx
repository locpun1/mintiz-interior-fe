import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { getCategoryLabel, NewsListProps } from "..";
import CommonImage from "@/components/Image/index";
import { CONTENT_NEWS } from "@/constants/contentAbout";
import { Facebook, Instagram, KeyboardBackspace, LinkedIn, Twitter } from "@mui/icons-material";
import IconButton from "@/components/IconButton/IconButton";

interface ContentNewDetailProps{
    newContent: NewsListProps,
    handleToggle: () => void;
}

const ContentNewDetail: React.FC<ContentNewDetailProps> = (props) => {
    const { newContent, handleToggle } = props;
    return(
        <Box>
            <Box
                    sx={{
                        color: 'white',
                        px: { xs: 2, md: 10 },
                        py: { xs: 4, md: 6 },
                        textAlign: 'left',
                    }}
                    display='flex' justifyContent='center'
                    flexDirection='column'
            >
                <Box sx={{ mb: 2}} display='flex' justifyContent='space-evenly'>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {getCategoryLabel(newContent.category)}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {newContent.date}
                    </Typography>
                </Box>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    mb={1}
                >
                    {newContent.title}
                </Typography>
                <Typography sx={{ fontSize: { xs: '13px', md: '16px'}}} textAlign='center' mb={5}>{`Trang chủ/Tin tức/${newContent.title}`}</Typography>
                <CommonImage
                    src={newContent.image}
                    sx={{
                        height: { xs: '100%', md: 600},
                        mb: 5
                    }}
                />
                {CONTENT_NEWS.map((param, idx) => (
                    <Typography key={idx} sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mt:1, fontSize: {xs: '14px', md: '16px'} }}>{param}</Typography>
                ))}
                <Button
                    onClick={handleToggle}
                    variant="text"
                    sx={{ 
                        mt: 1, color: "white", fontWeight: 500, fontSize: '16px', textDecoration: 'underline', 
                        '&:hover': { textDecoration: 'underline', textDecorationColor: '#fff', bgcolor: '#1C1A1B'} 
                    }}
                    startIcon={<KeyboardBackspace/>}
                    >
                        Quay lại
                </Button>
            </Box>
            <Box
                sx={{
                    borderTop: '1px solid white',
                    borderBottom: '1px solid white', 
                    color: 'white', 
                    py: 3, mb: 3,
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: 'space-around'},
                    flexDirection: { xs: 'column', md: 'row'},
                    alignItems:'center',
                }}
            >
                <Stack direction='row' sx={{ mb: { xs: 2, md: 0}}}>
                    <Typography sx={{ py: 0.8}}>Chia sẻ: </Typography>
                    <IconButton
                        handleFunt={() => {}}
                        icon={<Twitter sx={{color: 'white'}}/>}
                        border="3px solid white"
                        borderRadius={2}
                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<Facebook sx={{color: 'white'}}/>}
                        border="3px solid white"
                        borderRadius={2}
                        href="https://www.facebook.com/profile.php?id=61576721774771"
                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<Instagram sx={{color: 'white'}}/>}
                        border="3px solid white"
                        borderRadius={2}
                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<LinkedIn sx={{color: 'white'}}/>}
                        border="3px solid white"
                        borderRadius={2}
                    />
                </Stack>
                <Typography>BY MINTZ ADMIN</Typography>

            </Box>
            <Box sx={{ height: '50px'}}></Box>
       </Box>
    )
}

export default ContentNewDetail;