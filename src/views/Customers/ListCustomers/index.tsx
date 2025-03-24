import { useTranslation } from 'react-i18next';

import CustomerTable from './CustomerTable';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import PageWrapper from '@/components/PageWrapper';

const Customer = () => {
  const { t } = useTranslation('customer');
  return (
    <PageWrapper title={t('customer')}>
      <PageBreadcrumbs title={t('customer_list')} />
      <CustomerTable />
    </PageWrapper>
  );
};

export default Customer;
