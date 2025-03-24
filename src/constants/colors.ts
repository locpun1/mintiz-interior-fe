import { green, grey, red, yellow } from '@mui/material/colors';

export const COLORS = {
  PAYMENT_STATUS: {
    PAID: green[600],
    PENDING: red[600],
    CANCELLED: grey[600],
  },
  SERVICE_STATUS: {
    ACTIVE: green[600],
    INACTIVE: red[600],
    CANCEL: grey[600],
  },
  NEED_TO_PAY: yellow[600],
};
