import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  onClear: () => void;
  onExpanded?: () => void;
  openMoreFilter?: boolean;
  showClearButton?: boolean;
}

const ProFormFilterAction = (props: Props) => {
  const { t } = useTranslation('common');
  const { onExpanded, openMoreFilter, onClear, showClearButton } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ButtonGroup variant='contained' aria-label='outlined primary button group'>
        <Button type={'submit'} color='success' sx={{ py: 2.5, lineHeight: 0 }}>
          {t('actions.filter')}
        </Button>
        {typeof onExpanded === 'function' && (
          <Tooltip title={t('actions.filter_advanced')}>
            <Button color='info' onClick={onExpanded}>
              <ExpandMoreIcon sx={openMoreFilter ? { transform: 'rotate(180deg)' } : null} />
            </Button>
          </Tooltip>
        )}
      </ButtonGroup>
      {showClearButton && (
        <Button size='medium' variant='text' onClick={onClear}>
          {t('actions.reset')}
        </Button>
      )}
    </Box>
  );
};

export default ProFormFilterAction;
