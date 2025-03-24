import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import ActionButton from '@/components/ProButton/ActionButton';
import ProMenu from '@/components/ProMenu';

import { QueryPayloadType } from '@/types/common';
import { downloadFileCSV } from '@/utils/common';

interface BaseActionComponentProps {
  isFilter?: boolean;
  exportFunction: (params: QueryPayloadType) => Promise<any>;
  fileName: string;
  children?: React.ReactNode;
  additionalMenuItems?: Array<{
    label: string;
    value: number | string;
    onSelect: () => void;
    actionType?: string;
    disabled?: boolean;
  }>;
}

const BaseActionComponent = ({
  isFilter = false,
  exportFunction,
  fileName,
  children,
  additionalMenuItems = [],
}: BaseActionComponentProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' });

  const handleExportCSV = (params?: QueryPayloadType) => {
    const exportParams = isFilter ? params : {};
    downloadFileCSV({
      name: fileName,
      request: exportFunction(exportParams as QueryPayloadType),
    });
  };

  const defaultExportItem = {
    label: isFilter ? t('export_filter_data') : t('export_all_data'),
    value: 1,
    onSelect: () => handleExportCSV(),
    actionType: 'excel',
  };

  return (
    <Fragment>
      {children}
      <ProMenu items={[defaultExportItem, ...additionalMenuItems]}>
        <ActionButton iconPosition='end' actionType='expand' color='info'>
          {t('operations')}
        </ActionButton>
      </ProMenu>
    </Fragment>
  );
};

export default BaseActionComponent;
