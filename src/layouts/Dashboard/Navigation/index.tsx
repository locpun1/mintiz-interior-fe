import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from './components/MenuItem';
import sections from './sections';

const Navigation = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'common.white',
        zIndex: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xxl">
        <Toolbar variant="dense" sx={{ color: 'text.primary' }} disableGutters>
          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 1,
              height: 48,
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {sections.map((section, i) => (
              <MenuItem key={i} {...section} />
            ))}
          </List>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
