// src/views/Manager/components/SummaryCard.tsx
import { Card, CardContent, Typography, Box, CardHeader, Button } from '@mui/material';
import { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface SummaryCardProps {
    title: string;
    seeMoreLink?: string;
    children: ReactNode;
}

const SummaryCard: FC<SummaryCardProps> = ({ title, seeMoreLink, children }) => {
    return (
        <Card variant="outlined" sx={{
            borderRadius: 4,
            height: '100%',
        }}>
            <CardHeader
                title={
                    <Typography variant="h6" component="h2" fontWeight={600}>
                        {title}
                    </Typography>
                }
                action={
                    seeMoreLink && (
                        <Button
                            component={RouterLink}
                            to={seeMoreLink}
                            size="small"
                            endIcon={'>'}
                            sx={{ backgroundColor: 'unset', color: '#1C1A1B', fontSize: '16px', fontWeight: '700' }}
                        >
                            Xem thêm
                        </Button>
                    )
                }
                sx={{ pb: 0 }}
            />
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default SummaryCard;