import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';

const DialogContent = (props: BoxProps) => {
  const { children, ...rest } = props;
  return <Wrapper {...rest}>{children}</Wrapper>;
};

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.1),
}));

export default DialogContent;