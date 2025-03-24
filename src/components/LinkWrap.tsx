import Link from '@mui/material/Link';
import type { LinkProps } from '@mui/material/Link';

const LinkWrap = (props: LinkProps) => {
  return (
    <Link
      underline="none"
      variant="body2"
      target="_blank"
      rel="noopener"
      sx={{
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        fontWeight: 'medium',
      }}
      {...props}
    />
  );
};

export default LinkWrap;
