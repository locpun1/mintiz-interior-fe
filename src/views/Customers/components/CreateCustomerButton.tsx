import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import LinkButton from '@/components/LinkButton';
import { ROUTE_PATH } from '@/constants/routes';

const CreateCustomerButton = () => {
  const { t } = useTranslation('customer');

  return (
    <Box sx={{ margin: '2px' }}>
      <LinkButton
            to={`${ROUTE_PATH.CUSTOMERS_CREATE}`}
            variant='contained'
            type='create'
            color='success'
          >
            {t('add_new')}
          </LinkButton>
    </Box>
  );
};

export default CreateCustomerButton;
