import { Box, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import Grid from '@mui/material/Grid2'
import { CONTENT_MISSION, CONTENT_SERVICE } from "@/constants/contentAbout";
import CommonImage from "@/components/Image/index";

const MissionDevelopment: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h5" fontWeight={600}>Sứ mệnh phát triển</Typography>
            <Typography textAlign='center' sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mt: 3, fontSize: {xs: '12px', md: '16px'}}}>
                Mintz Funi luôn tự hào là đơn vị uy tín hàng đầu trong lĩnh vực thiết kế nội thất khách sạn và resort, với thế mạnh lên ý tưởng sáng tạo, tư vấn tận tâm và đồng hành cùng khách hàng để mang đến những giải pháp thiết kế tối ưu, phù hợp từng mục tiêu kinh doanh.Khởi đầu xây dựng là những con người có đam mê và tâm huyết, sau nhiều năm hoạt động thì chúng tôi dần đã trờ thành đơn vị nhà thầu có độ tin cậy tuyệt đối với những khách hàng có nhu cầu về thiết kế nội thất hiện nay.
            </Typography>
            <Grid container spacing={2}>
                {CONTENT_MISSION.map((content, index) => {
                    return(
                        <Grid size={{ xs: 12, sm: 6, md: 3}}>
                            <Box
                                display='flex'
                                flexDirection='column'
                                key={index}
                                alignItems='center'
                                mt={3}
                            >
                                <CommonImage
                                    src={content.image}
                                    sx={{
                                        bgcolor: '#fff',
                                        width: '75%',
                                        height: '50%'
                                    }}
                                />
                                <Typography mt={2} textAlign='center' sx={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: {xs: '13px', md: '16px'}}}>
                                    {content.label}
                                </Typography>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
            <Typography sx={{ borderTop: '2px solid white', py: 1, mt: 4}} variant="h5" fontWeight={600}>Dịch vụ của chúng tôi</Typography>
            {CONTENT_SERVICE.map((content, index) => {
                return(
                    <Grid key={index} sx={{ mt: 3}} container spacing={4} direction={ content.isReverse === true ? 'row-reverse' : 'row'}>
                        <Grid size={{ xs: 12, md: 6}}>
                            <CommonImage
                                src={content.image}
                                sx={{
                                    width: { xs: '100%', md: '100%'},
                                    height: { xs: 200, md: 300 },
                                    borderRadius: 2
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6}}>
                            <Box display='flex' flexDirection='row' gap={1}>
                                <Typography variant="h4" sx={{ fontWeight: 700}}>
                                    {content.stt}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 400, whiteSpace: 'normal', wordBreak: 'break-word', mt: { xs: 0, md: 0.5} }}>
                                    {content.title}
                                </Typography>
                            </Box>
                            {content.content.map((item, idx) => {
                                return (
                                    <Stack key={idx} direction='column'>
                                        <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word',fontSize: {xs: '13px', md: '15px'} }}>{`• ${item}`}</Typography>
                                    </Stack>
                                )
                            })}
                        </Grid>
                    </Grid>
                )
            })}
        </Box>
    )
}
export default MissionDevelopment;