import { Box, Tabs, Tab } from '@mui/material';
import React from 'react';
import { CategoryType, ViewModeProps } from '..';


interface Props {
  viewMode: CategoryType;
  onChange: (mode: CategoryType) => void;
  DataViewMode: ViewModeProps[]
}

const TabsViewSwitcher: React.FC<Props> = ({ viewMode, onChange, DataViewMode }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue as CategoryType);
  };

  return (
    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Tabs 
        value={viewMode} 
        onChange={handleChange} 
        variant="standard"
        textColor='inherit'
        indicatorColor="secondary"
        sx={{
          mb: 2,
          '& .MuiTab-root': { color: 'white', fontWeight: 500 },
          '& .MuiTabs-indicator': { backgroundColor: 'white' },
        }}
    >
        {DataViewMode.map((data, index) => {
            return (
                <Tab 
                    key={index}
                    label={data.label} value={data.value} 
                    sx={{
                        color: '#fff',
                        px: 6
                    }}
                />
            )
        })}
      </Tabs>
    </Box>
  );
};

export default TabsViewSwitcher;