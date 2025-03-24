import type { HTMLAttributes, MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { cloneElement, Fragment, isValidElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import LinkIcon from '@mui/icons-material/Link';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import PrintIcon from '@mui/icons-material/Print';
import RedeemIcon from '@mui/icons-material/Redeem';
import ReplyIcon from '@mui/icons-material/Reply';
import SaveIcon from '@mui/icons-material/Save';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import UploadIcon from '@mui/icons-material/Upload';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import type { MenuProps } from '@mui/material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';

import { ExcelIcon } from '@/icons/SvgIcons';

const icons = {
  delete: DeleteIcon,
  edit: EditIcon,
  save: SaveIcon,
  cancel: CloseIcon,
  sub: IndeterminateCheckBoxOutlinedIcon,
  view: VisibilityIcon,
  gift: RedeemIcon,
  print: PrintIcon,
  back: ReplyIcon,
  load: AutorenewIcon,
  excel: ExcelIcon,
  bank: AccountBalanceOutlinedIcon,
  money: MoneyOutlinedIcon,
  add: AddIcon,
  description: DescriptionIcon,
  sms: EmailIcon,
  email: AlternateEmailIcon,
  phone: PhoneIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  tag: LocalOfferIcon,
  tree: AccountTreeIcon,
  sync: SyncAltIcon,
  change: ImportExportIcon,
  remove: HighlightOffIcon,
  link: LinkIcon,
  arrowRight: ArrowForwardIcon,
  arrowLeft: ArrowBackIcon,
  tags: LocalOfferIcon,
  credit: CreditCardIcon,
  upgrade: UpgradeIcon,
} as const;

type Trigger = 'click' | 'hover' | 'contextMenu';

export type Item<T> =
  | {
      label: string;
      value: T;
      disabled?: boolean;
      onSelect?: MouseEventHandler<HTMLLIElement>;
      actionType?: keyof typeof icons;
      color?: TypographyProps['color'];
    }
  | {
      label: string;
      to: string;
      isNewTab?: boolean;
      disabled?: boolean;
      actionType?: keyof typeof icons;
      color?: TypographyProps['color'];
    }
  | { type: 'divider' };

interface Origin {
  anchorOrigin: MenuProps['anchorOrigin'];
  transformOrigin: MenuProps['transformOrigin'];
}

interface Props<T extends string | number> {
  trigger?: Trigger[];
  MenuProps?: Partial<MenuProps>;
  children: ReactElement<any>;
  items: Item<T>[] | any[];
  selected?: T;
  onSelect?: (value: T) => void;
  position?: 'left' | 'right';
}

const ProMenu = <T extends string | number>(props: Props<T>) => {
  const { trigger = ['click'], children, MenuProps, items, selected, onSelect, position } = props;
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleChange = (value: T) => () => {
    onSelect?.(value);
    handleClose();
  };

  const origin: Origin | {} =
    position === 'left'
      ? {
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          transformOrigin: { vertical: 'top', horizontal: 'right' },
        }
      : {};

  return (
    <Fragment>
      {isValidElement<HTMLAttributes<HTMLButtonElement>>(children)
        ? cloneElement(children, {
            onClick: trigger.includes('click') ? handleClick : void 0,
          })
        : null}
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1 } }}
        MenuListProps={{ dense: true }}
        {...origin}
        {...MenuProps}
      >
        {items?.filter(Boolean).map((item, i) => {
          if ('type' in item) {
            return <Divider key={i} />;
          } else if ('to' in item) {
            const { label, to, isNewTab, actionType, disabled, color } = item;

            const Icon = actionType && icons[actionType as keyof typeof icons];

            return (
              <MenuItem
                key={i}
                disabled={disabled}
                onClick={handleClose}
                component={RouterLink}
                {...(isNewTab && {
                  target: '_blank',
                  rel: 'noopener',
                })}
                to={to}
              >
                {Icon && (
                  <ListItemIcon>
                    <Icon sx={{ color }} />
                  </ListItemIcon>
                )}
                <ListItemText>
                  <Typography variant='body2' color={color}>
                    {label}
                  </Typography>
                </ListItemText>
              </MenuItem>
            );
          }

          const { label, value, disabled, onSelect, actionType, color } = item;

          const Icon = actionType && icons[actionType as keyof typeof icons];

          const handleClick: MouseEventHandler<HTMLLIElement> = (event) => {
            onSelect?.(event);
            handleClose();
          };

          return (
            <MenuItem
              key={i}
              onClick={onSelect ? handleClick : handleChange(value)}
              selected={selected === value}
              disabled={disabled}
            >
              {Icon && (
                <ListItemIcon>
                  <Icon sx={{ color }} />
                </ListItemIcon>
              )}
              <ListItemText>
                <Typography variant='body2' color={color}>
                  {label}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
};

export default ProMenu;
