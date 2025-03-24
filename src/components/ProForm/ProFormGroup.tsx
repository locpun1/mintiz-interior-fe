import type { FormGroupProps } from '@mui/material/FormGroup';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';

const ProFormGroup = (props: FormGroupProps) => {
  const { children, ...rest } = props;

  return <Wrapper {...rest}>{children}</Wrapper>;
};

const Wrapper = styled(FormGroup)(({ theme }) => ({
  '& + &': {
    marginTop: theme.spacing(2),
  },
}));

export default ProFormGroup;
