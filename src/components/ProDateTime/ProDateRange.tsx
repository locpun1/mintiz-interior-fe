import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { Fragment, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DateRangeIcon from '@mui/icons-material/DateRange';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DatePickerProps } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { DateFormat, DateTimeLocaleText } from '@/constants/locale';

interface Props {
  from: string;
  to: string;
  label?: string;
  startDatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  endDatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  disableFuture?: boolean;
  confirmOnly?: boolean;
}

export default function ProDateRange(props: Props) {
  const { from, to, label, endDatePickerProps, startDatePickerProps, disableFuture } = props;
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const { i18n } = useTranslation('date');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const { control } = useFormContext();

  const {
    field: { value: fromValue, onChange: fromOnChange },
  } = useController({ name: from, control });

  const {
    field: { value: toValue, onChange: toOnChange },
  } = useController({ name: to, control });

  const formatDate = (date: dayjs.Dayjs | undefined) => {
    return date && date.isValid() ? date.locale('vi').format(DateFormat) : '';
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language}
      localeText={DateTimeLocaleText()}
    >
      <Fragment>
        <Wrapper ref={ref} focused={focused} onClick={handleOpen}>
          <Label component='label' focused={focused} variant='body1' htmlFor={from} noWrap>
            {label}
          </Label>
          <InputBase
            name={from}
            value={formatDate(dayjs(fromValue) || null)}
            placeholder='DD/MM/YYYY'
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
              zIndex: 1,
              pointerEvents: 'none',
              '& .MuiInputBase-input': {
                py: '8.5px',
                pl: 1.75,
                width: '11.5ch',
              },
            }}
          />
          <Box sx={{ px: 0.5 }}>{'-'}</Box>
          <InputBase
            name={to}
            value={formatDate(dayjs(toValue) || null)}
            placeholder='DD/MM/YYYY'
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
              zIndex: 1,
              pointerEvents: 'none',
              '& .MuiInputBase-input': {
                py: '8.5px',
                pl: 0.5,
                width: '11.5ch',
              },
            }}
          />
          <IconButton onClick={handleOpen} sx={{ mr: 1, zIndex: 1, ml: 'auto' }}>
            <DateRangeIcon />
          </IconButton>
          <Fieldset focused={focused}>
            <Legend label={!!label}>
              <Span>{label}</Span>
            </Legend>
          </Fieldset>
        </Wrapper>
        <Popover
          open={open}
          anchorEl={ref.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              '& .MuiPickersDay-root': {
                borderRadius: 1,
              },
            }}
          >
            <StaticDatePicker
              displayStaticWrapperAs='desktop'
              dayOfWeekFormatter={(weekday) => `${weekday.format('dd')}`}
              value={dayjs(fromValue)}
              onChange={(date) => {
                fromOnChange(date?.startOf('d'));
                if (date && toValue && date.isAfter(dayjs(toValue))) {
                  toOnChange(date.endOf('d'));
                }
              }}
              slotProps={{
                actionBar: props.confirmOnly
                  ? {
                      actions: [],
                    }
                  : { actions: ['clear', 'today'] },
              }}
              disableFuture={disableFuture}
              {...startDatePickerProps}
            />
            <StaticDatePicker
              displayStaticWrapperAs='desktop'
              dayOfWeekFormatter={(weekday) => `${weekday.format('dd')}`}
              onChange={(date) => {
                toOnChange(date?.endOf('d'));
                if (date && fromValue && date.isBefore(dayjs(fromValue))) {
                  fromOnChange(date.startOf('d'));
                }
              }}
              slotProps={{
                actionBar: props.confirmOnly
                  ? {
                      actions: ['accept'],
                      onAccept: handleClose,
                    }
                  : { actions: ['clear', 'today'] },
              }}
              disableFuture={disableFuture}
              {...endDatePickerProps}
            />
          </Box>
        </Popover>
      </Fragment>
    </LocalizationProvider>
  );
}

const Wrapper = styled('div', {
  shouldForwardProp: (prop: string) => !['focused'].includes(prop),
})<{ focused: boolean }>(({ theme, focused }) => ({
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 4,
  position: 'relative',
  cursor: 'pointer',
  ...(!focused && {
    '&:hover': {
      '& fieldset': {
        borderColor: theme.palette.text.primary,
      },
    },
  }),
}));

const Fieldset = styled('fieldset', {
  shouldForwardProp: (prop: string) => !['focused'].includes(prop),
})<{ focused: boolean }>(({ theme, focused }) => ({
  position: 'absolute',
  top: -5,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: theme.spacing(0, 1),
  pointerEvents: 'none',
  overflow: 'hidden',
  minWidth: '0%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderRadius: 'inherit',
  ...(focused && {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  }),
}));

const Legend = styled('legend', {
  shouldForwardProp: (prop: string) => !['label'].includes(prop),
})<{ label: boolean }>(({ theme, label }) => ({
  float: 'unset',
  width: label ? 'auto' : 0,
  overflow: 'hidden',
  display: 'block',
  padding: 0,
  height: 11,
  fontSize: '0.75em',
  visibility: 'hidden',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
}));

const Span = styled('span')(({ theme }) => ({
  paddingLeft: 5,
  paddingRight: 5,
  display: 'inline-block',
  opacity: 0,
  visibility: 'visible',
}));

const Label = styled(Typography<'label'>, {
  shouldForwardProp: (prop: string) => !['focused'].includes(prop),
})<{ focused: boolean }>(({ theme, focused }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  transform: 'translate(14px, -9px) scale(0.75)',
  transformOrigin: 'top left',
  zIndex: 1,
  pointerEvents: 'auto',
  userSelect: 'none',
  maxWidth: 'calc(133% - 24px)',
  color: theme.palette.text.secondary,
  ...(focused && {
    color: theme.palette.primary.main,
  }),
}));
