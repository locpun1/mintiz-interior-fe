import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2"
import { Box, Stack, Typography } from "@mui/material";
import { IDesignAndBuild } from "@/types/settings";
import { getDesignAndBuilds } from "@/services/settings-service";
import { getPathImage } from "@/utils/url";

const PlanDrawing: React.FC = () => {
    const page = 0;
    const rowsPerPage = 4;
    const [designAndBuilds, setDesignAndBuilds] = useState<IDesignAndBuild[]>([]);
    
    useEffect(() => {
        const fetchDesignAndBuilds = async() => {
            const res = await getDesignAndBuilds({ page: page, size: rowsPerPage});
            const data = res.data?.designAndBuilds as any as IDesignAndBuild[];
            setDesignAndBuilds(data);
        }
        fetchDesignAndBuilds()
    }, [page, rowsPerPage])

    return(
        <Grid container>
            {designAndBuilds.slice(0,3).map((data, index) => {
                return(
                    <Grid key={index} size={{ xs: 12, md:4}}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: {xs: 300, md: 400}, // Chiều cao thu gọn lại
                                width: '100%',
                                backgroundImage: `url(${getPathImage(data.image_url)})`,
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
                                    <Typography fontWeight={500} sx={{ whiteSpace: 'normal', wordBreak: 'break-word', my: 1.5, fontSize: {xs: '20px', md: '25px'}}}>{data.title}</Typography>
                                    <Stack direction='column'>
                                        {data.content.split('\n').map((line, idx) => {
                                            const newLine = line.replace('/^\s*[-*~>]/', '•');
                                            return (
                                                <Typography 
                                                    key={idx}
                                                    textAlign='left' 
                                                    sx={{ 
                                                        whiteSpace: 'normal', wordBreak: 'break-word',fontSize: {xs: '13px', md: '15px'},
                                                    }}
                                                >
                                                    {`${newLine.trim()}`}
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