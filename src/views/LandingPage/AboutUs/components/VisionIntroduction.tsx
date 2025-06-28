import { CONTENT_VISION } from "@/constants/contentAbout";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

interface VisionIntroductionProps{

}

const VisionIntroduction: React.FC<VisionIntroductionProps> = (props) => {
    const { } = props;
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-around',
                mt: 2,
                gap: { xs: 0, md: 12},
                flexDirection: { xs: 'column', md: 'row'},
                width: '100%'
            }}
        >
            <Box
                sx={{
                    py: 2,
                    borderTop: '1px solid white',
                    borderBottom: {xs: '1px solid white', md: 0},
                    width: { xs: '100%', md: '35%'}
                }}
            >
                <Typography textAlign={{ xs: 'center', md: 'start'}} variant="h4" fontWeight={600}>Tầm nhìn của MINTZ FUNI</Typography>
                <Typography textAlign={{ xs: 'center', md: 'start'}} sx={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: {xs: '12px', md: '16px'}}}>
                    {`Mintz Funi định vị mình là đối tác chiến lược cho các chủ đầu tư khách sạn và resort tại Việt Nam. Chúng tôi hướng tới mục tiêu trở thành đơn vị thiết kế nội thất khách sạn và resort hàng đầu, tiên phong trong việc mang đến:`}
                </Typography>
            </Box>
            <Stack direction='column' sx={{ width: { xs: '100%', md: '65%'}}}>
                {CONTENT_VISION.map((content, index) => {
                    const title = content.content.split(':')[0];
                    const titleContent = content.content.split(':')[1];
                    return(
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: { xs: 'center', sm: 'center', md: 'flex-start'},
                                alignItems: { xs: 'center', sm: 'center', md: 'flex-start'},
                                py: 2,
                                gap: 4,
                                borderBottom: CONTENT_VISION.length - 1 > index ? '1px solid white' : 0
                            }}
                        >
                                <Typography fontWeight={700} variant="h4">{content.stt}</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: { xs: '13px', md: '16px'}}}> 
                                    <b>{`${title}: `}</b>{titleContent}
                                </Typography>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    )
}

export default VisionIntroduction;