import type { IconButtonProps } from '@mui/material/IconButton';
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import ViFLag from '/imgs/flags/ic-flag-vi.svg';
import EnFLag from '/imgs/flags/ic-flag-en.svg';
import JpFLag from '/imgs/flags/ic-flag-jp.svg';
import { Avatar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type SelectLanguageProps = IconButtonProps & {
  value: string;
  label: string;
  icon: string;
};

interface Props {
  sizeIcon?: number;
  sizeButton?: number;
}

export default function SelectLanguage(props: Props) {
  const { i18n } = useTranslation();
  const { sizeIcon = 20, sizeButton = 30 } = props;

  const data: SelectLanguageProps[] = [
    {
      value: 'vi',
      label: 'Tiếng Việt',
      icon: ViFLag,
    },
    {
      value: 'ja',
      label: '日本',
      icon: JpFLag,
    },
    {
      value: 'en',
      label: 'English',
      icon: EnFLag,
    },
  ];

  const [locale, setLocale] = useState<string>();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setLocale(i18n.language);
  }, [i18n.language]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      setLocale(newLang);
      i18n.changeLanguage(newLang);
      localStorage.setItem('i18nConfig', JSON.stringify(newLang));
      handleClosePopover();
    },
    [i18n, handleClosePopover],
  );

  const currentLang = data.find((lang) => lang.value === locale);

  const renderFlag = (label?: string, icon?: string) => (
    <Avatar alt={label} src={icon} sx={{ width: sizeIcon, height: sizeIcon, background: 'none' }} />
  );

  return (
    <Box>
      <Tooltip title={currentLang?.label}>
        <IconButton
          onClick={handleOpenPopover}
          sx={{
            width: sizeButton,
            height: sizeButton,
            ...(openPopover && { bgcolor: 'action.selected' }),
          }}
        >
          {renderFlag(currentLang?.label, currentLang?.icon)}
        </IconButton>
      </Tooltip>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 999,
          marginTop: '17px !important',
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data?.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang?.value}
              onClick={() => handleChangeLang(option.value)}
              sx={{
                fontSize: '14px',
              }}
            >
              {renderFlag(option.label, option.icon)}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
}
