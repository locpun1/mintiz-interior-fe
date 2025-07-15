import DialogComponent from "@/components/DialogComponent";
import CommonImage from "@/components/Image/index";
import { IDesignAndBuild } from "@/types/settings";
import { getPathImage } from "@/utils/url";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";

interface ModalDetailDesignAndBuildProps{
    open: boolean,
    onClose: () =>  void;
    designAndBuild: IDesignAndBuild;
}

const ModalDetailDesignAndBuild: React.FC<ModalDetailDesignAndBuildProps> = ({ open, onClose, designAndBuild}) => {
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
                    src={getPathImage(designAndBuild.image_url)}
                    sx={{ width: 300, height: 200}}
                />
            </Stack>
            <Typography fontWeight={500} variant="body1">{designAndBuild.title}</Typography>
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
                    {designAndBuild.content.split('\n').map((line, index) => {
                        const newLine = line.replace('/^\s*[-*~>•]/', '•');
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
            <Stack mt={2} justifyContent='flex-end'>
                <Button 
                    variant="outlined" 
                    sx={{ 
                        border: 'solid 1px #1C1A1B', color: '#1C1A1B',
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

export default ModalDetailDesignAndBuild;