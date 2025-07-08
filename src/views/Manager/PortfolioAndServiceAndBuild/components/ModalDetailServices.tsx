import DialogComponent from "@/components/DialogComponent";
import CommonImage from "@/components/Image/index";
import { IServices } from "@/types/settings";
import { getPathImage } from "@/utils/url";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

interface ModelDetailServicesProps{
    open: boolean,
    onClose: () =>  void;
    service: IServices;
}

const ModelDetailServices: React.FC<ModelDetailServicesProps> = ({ open, onClose, service}) => {
    return (
        <DialogComponent
            dialogKey={open}
            handleClose={onClose}
            isActiveFooter={false}
            isActiveHeader={false}
            isCenter={true}
        >
            <Stack sx={{ display: 'flex', justifyContent: 'center', alignContent:'center', mb:2}}>
                <CommonImage
                    src={getPathImage(service.image_url)}
                    sx={{ width: 300, height: 200}}
                />
            </Stack>
            <Typography fontWeight={500} variant="body1">{service.order}. {service.title}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center'
                }}
            >
                <Stack direction='column'>
                    {service.content.split('\n').map((line, index) => {
                        const newLine = line.replace('/^\s*[-*~>]/', '•');
                        return (
                        <Typography 
                            textAlign='left' key={index} 
                            sx={{ 
                                whiteSpace: 'normal', wordBreak: 'break-word',
                                fontSize: {xs: '13px', md: '15px'} 
                            }}
                        >
                            {`${newLine.trim()}`}
                        </Typography>   
                    )})}
                </Stack>
            </Box>
            <Stack justifyContent='flex-end'>
                <Button 
                    variant="outlined" 
                    sx={{ 
                        border: 'solid 1px #1C1A1B', color: '#1C1A1B',
                        mt: 1,
                        width: 100
                    }}
                    onClick={onClose}
                >
                    Đóng
                </Button>
            </Stack>
        </DialogComponent> 
    )
}

export default ModelDetailServices;