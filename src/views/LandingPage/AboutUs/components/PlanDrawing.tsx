import React from "react";
import Grid from "@mui/material/Grid2"
import { CONTENT_PLAN } from "@/constants/contentAbout";
import { Box, Stack, Typography } from "@mui/material";

const PlanDrawing: React.FC = () => {
    return(
        <Grid container>
            {CONTENT_PLAN.map((content, index) => {
                return(
                    <Grid key={index} size={{ xs: 12, md:4}}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: {xs: 300, md: 400}, // Chiều cao thu gọn lại
                                width: '100%',
                                backgroundImage: `url(${content.image})`,
                                backgroundSize: '100% 100%',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                textAlign: 'center',
                                px: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset:{ xs: '50% 0px 0px', md: "58% 0px 0px"},
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    zIndex:1
                                }}
                            >
                                <Box
                                    sx={{
                                        zIndex: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        textAlign: 'center',
                                        width: '100%',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography fontWeight={500} sx={{ whiteSpace: 'normal', wordBreak: 'break-word', my: 1.5, fontSize: {xs: '20px', md: '25px'}}}>{content.title}</Typography>
                                    <Stack direction='column'>
                                        {content.content.map((item, idx) => {
                                            return (
                                                <Typography 
                                                    key={idx}
                                                    textAlign='left' 
                                                    sx={{ 
                                                        whiteSpace: 'normal', wordBreak: 'break-word',fontSize: {xs: '13px', md: '15px'},
                                                    }}
                                                >
                                                    {`• ${item}`}
                                                </Typography>
                                            )
                                        })}
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                )
            })}
        </Grid>
    )
}
export default PlanDrawing;