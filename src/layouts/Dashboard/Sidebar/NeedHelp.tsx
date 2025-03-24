import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const NeedHelp = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography color="text.secondary" variant="subtitle2">
        Need Help?
      </Typography>
      <Typography color="neutral.500" variant="body2">
        Check our docs
      </Typography>
      <Button color="secondary" variant="contained" fullWidth sx={{ mt: 2 }}>
        Documentation
      </Button>
    </Box>
  );
};

export default NeedHelp;
