import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onReset: () => void;
}

const ProFormSearchActions = (props: Props) => {
  const { onReset } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 1,
      }}
    >
      <Stack direction="row" spacing={1.5}>
        <Button startIcon={<SearchIcon />} type="submit">
          Tìm kiếm
        </Button>
        <Button startIcon={<CloseIcon />} variant="outlined" onClick={onReset}>
          Xóa bộ lọc
        </Button>
      </Stack>
    </Box>
  );
};

export default ProFormSearchActions;
