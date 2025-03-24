import { type ElementType, type HTMLAttributes, type PropsWithChildren } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

import { TextFieldProps } from '@mui/material';
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { GridOwnProps } from '@mui/material/Grid';
import Grid from '@mui/material/Grid2';
import type { PaperProps } from '@mui/material/Paper';
import Paper from '@mui/material/Paper';
import ProFormContent from './ProForm/ProFormContent';
import ProFormFilterAction from './ProForm/ProFormFilterAction';
import ProFormHeader from './ProForm/ProFormHeader';
import ProFormTextField from './ProForm/ProFormTextField';

interface Props<T extends FieldValues> extends HTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<T, any>;
  paper?: boolean;
  PaperProps?: Partial<PaperProps>;
  BoxProps?: Partial<BoxProps>;
  onFinish?: (values: T) => Promise<void> | void;
  onError?: (errors: unknown) => Promise<void> | void;
  grid?: boolean;
  searchProps: TextFieldProps & { name?: string };
  containerProps?: GridOwnProps;
  header?: string;
  headerProps?: BoxProps;
  filterActionProps: {
    onClear: () => void;
    onExpanded?: () => void;
    openMoreFilter?: boolean;
    showClearButton?: boolean;
  };
  isHideSearch?: boolean;
}

const FormFilterTable = <T extends FieldValues>(props: PropsWithChildren<Props<T>>) => {
  const {
    containerProps,
    searchProps = { name: 'keyword' },
    children,
    form,
    paper = true,
    BoxProps = {},
    onFinish,
    onError,
    grid,
    filterActionProps,
    PaperProps = {
      sx: {
        ...(paper && {
          p: 2,
        }),
        ...(grid && {
          p: 2,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: 2.5,
        }),
      },
    },
    header,
    headerProps = {},
    isHideSearch = false,
    ...rest
  } = props;

  const Component: ElementType = paper ? Paper : Box;

  return (
    <FormProvider {...form}>
      <ProFormContent>
        {header && <ProFormHeader {...headerProps}>{header}</ProFormHeader>}
        <Component
          noValidate
          component='form'
          onSubmit={onFinish ? form.handleSubmit(onFinish, onError) : void 0}
          {...PaperProps}
          {...BoxProps}
          {...rest}
        >
          <Grid
            columns={24}
            container
            spacing={{ xs: 2, xl: 3 }}
            alignItems='center'
            {...containerProps}
          >
            {!isHideSearch && (
              <Grid size={{ xs: 24, sm: 10, md: 7 }}>
                <ProFormTextField
                  {...searchProps}
                  name={searchProps?.name ?? 'keyword'}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            )}
            {children}
            <Grid size={{ xs: 24, sm: 12, md: 5, lg: 4, xl: 3 }}>
              <ProFormFilterAction {...filterActionProps} />
            </Grid>
          </Grid>
        </Component>
      </ProFormContent>
    </FormProvider>
  );
};

export default FormFilterTable;
