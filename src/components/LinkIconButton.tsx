import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import type { LinkProps } from '@mui/material/Link';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const Icons = {
  view: VisibilityIcon,
  edit: EditIcon,
};

type RouterLinkProps = typeof RouterLink;

type LinkIconButtonProps = LinkProps<
  RouterLinkProps,
  {
    component?: RouterLinkProps;
    disabled?: boolean;
    IconButtonProps?: IconButtonProps;
    type?: 'view' | 'edit';
  }
>;

const LinkIconButton = (props: LinkIconButtonProps) => {
  const { to, children, disabled, type, IconButtonProps, ...rest } = props;

  const StartIcon = type && type in Icons ? Icons[type] : void 0;

  if (disabled) {
    return (
      <IconButton {...IconButtonProps} disabled={disabled}>
        {children || (StartIcon && <StartIcon />)}
      </IconButton>
    );
  }

  return (
    <Link component={RouterLink} to={to} {...rest}>
      <IconButton {...IconButtonProps}>
        {children || (StartIcon && <StartIcon />)}
      </IconButton>
    </Link>
  );
};

export default LinkIconButton;
