import PhotoIcon from '@mui/icons-material/Photo';
import Avatar from '@mui/material/Avatar';
import { memo } from 'react';

interface Props {
  src?: string | null;
}

const ProductImage = (props: Props) => {
  const { src } = props;
  return (
    <Avatar
      alt="Product Image"
      src={src || void 0}
      sx={{ width: 40, height: 40 }}
    >
      <PhotoIcon />
    </Avatar>
  );
};

export default memo(ProductImage);
