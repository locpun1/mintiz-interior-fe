import type { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface Props extends BoxProps {
  title: string;
  icon?: SvgIconComponent;
  description?: string;
}

const DialogHeader = (props: Props) => {
  const { title, icon: Icon, children, description, ...rest } = props;
  return (
    <Wrapper {...rest}>
      {Icon && (
        <Icon
          sx={{
            mt: 3,
            p: 1.2,
            background: '#f5f5f5',
            borderRadius: '50%',
            fontSize: 45,
            color: '#7c7d7f',
          }}
        />
      )}
      {children && children}
      <Typography sx={{ fontWeight: 600, fontSize: 17, mt: 1 }} color='#121828' gutterBottom>
        {title}
      </Typography>
      {description && <Typography variant='subtitle2'>{description}</Typography>}
    </Wrapper>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.palette.divider,
}));

export default DialogHeader;
