// src/components/ConfirmDialog.tsx
import { FC, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import Button from './Button/Button';
import InputText from './InputText';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  isSubmitting?: boolean;

  requiresInput?: boolean;
  inputLabel?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'primary',
  isSubmitting = false,
  requiresInput = false,
  inputLabel = 'Lý do',
  inputValue = '',
  onInputChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={requiresInput ? "sm" : "xs"}>
      <DialogTitle fontWeight={600}>{title}</DialogTitle>
      <DialogContent>
        {content && <Typography sx={{ mb: requiresInput ? 2 : 0, fontSize: '20px', fontWeight: '700' }}>{content}</Typography>}
        {requiresInput && (
          <InputText
          type="text"
          name="reason"
          value={inputValue}
          onChange={(_name, value) => {
            onInputChange?.(value as string);
          }}
        />
        )}
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 20px' }}>
        <Button handleFunt={onConfirm}
          customVariant="primary"
          color={confirmColor}
          backgroundColor="#1C1A1B"
          fontColor="##FFFFFF"
          width='auto'
          fontSize="16px"
          borderRadius="16px"
          disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : confirmText}
        </Button>
        <Button handleFunt={onClose}
          customVariant="secondary"
          borderRadius="16px"
          border="2px solid #1C1A1B"
          fontColor="#1C1A1B">
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;