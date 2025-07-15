import ImageIcon from '@mui/icons-material/Image';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Page from '@/components/Page';
import FilterTabs from '../Account/components/FilterTabs';
import InputSearch from '@/components/SearchBar';
import ImageSlide from './components/ImageSlide';
import Services from './components/Services';
import DesignAndBuild from './components/DesignAndBuild';

export interface DataProps{
    id: number | string;
    value: number | string;
    label: string;
    icon: React.ReactNode;
}

const Data: DataProps[] = [
    {
        id: 1,
        value: 1,
        label: 'Hình ảnh',
        icon: <ImageIcon sx={{ color: '#e57373'}} fontSize='small'/>
    },
    {
        id: 2,
        value: 2,
        label: 'Dịch vụ',
        icon: <TrackChangesIcon sx={{ color: '#64b5f6'}} fontSize='small'/>
    },
    {
        id: 3,
        value: 3,
        label: 'Thiết kế & thi công',
        icon: <DesignServicesIcon  sx={{ color: '#81c784'}} fontSize='small'/>
    }
]

const ManagementPortfolioServiceBuild: React.FC = () => {
    const [viewMode, setViewMode] = useState<1 | 2 | 3>(1);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (value: string) => {
        setSearchTerm(value.trim())
    }
    return(
        <Box p={2}>
            <Page title='Quản lý Portfolio, Dịch vụ, Thiết kế và thi công'>
                <InputSearch
                        initialValue={searchTerm}
                        placeholder='Tìm kiếm'
                        onSearch={handleSearch}
                />
                <Box mt={2}>
                    <FilterTabs data={Data} viewMode={viewMode} onChange={setViewMode} />
                </Box>
                {viewMode === 1 && <ImageSlide searchTerm={searchTerm} />}
                {viewMode === 2 && <Services searchTerm={searchTerm} />}
                {viewMode === 3 && <DesignAndBuild searchTerm={searchTerm} />}
            </Page>
        </Box>
    )
}

export default ManagementPortfolioServiceBuild;