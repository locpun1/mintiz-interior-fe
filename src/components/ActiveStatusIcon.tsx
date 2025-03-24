import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { SvgIconProps } from '@mui/material';
import { green, grey } from '@mui/material/colors';

type Props = {
  isActive: boolean;
} & SvgIconProps;

export default function ActiveStatusIcon({ isActive, ...rest }: Props) {
  return (
    <FiberManualRecordIcon
      sx={{ color: isActive ? green[600] : grey[500], verticalAlign: 'middle' }}
      {...rest}
    />
  );
}
