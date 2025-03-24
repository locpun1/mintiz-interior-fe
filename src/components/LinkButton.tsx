import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Icons = {
  back: ArrowBackIcon,
  create: AddIcon,
  edit: EditIcon,
  save: SaveIcon,
  forward: ArrowForwardIcon,
};

type RouterLinkProps = typeof RouterLink;

type LinkButtonProps = ButtonProps<
  RouterLinkProps,
  {
    component?: RouterLinkProps;
    type?: 'back' | 'create' | 'edit' | 'save' | 'forward';
  }
>;

const LinkButton = (props: LinkButtonProps) => {
  const { to, children, type, ...rest } = props;

  const StartIcon = type && type in Icons ? Icons[type] : void 0;

  return (
    <Button
      component={RouterLink}
      to={to}
      size="small"
      variant="outlined"
      startIcon={StartIcon && <StartIcon />}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
