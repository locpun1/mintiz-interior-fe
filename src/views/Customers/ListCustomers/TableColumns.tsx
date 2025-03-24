import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { ActionRowParams, useBaseColumns } from '@/components/DynamicFormTable/BaseColumns';
import Selection from '@/components/ProTable/components/Selection';
import { HeadCell } from '@/components/ProTable/types';
import { getColumnHelper } from '@/components/ProTable/utils/getColumnHelper';

import { ROUTE_PATH } from '@/constants/routes';
import useDialog from '@/hooks/useDialog';
import useNotification from '@/hooks/useNotification';
import { deleteCustomer } from '@/services/customer-service';
import { Customer } from '@/types/customer-types';

const columnHelper = getColumnHelper<Customer>();

const createDetailLink = (label: string, to: string, isClickable: boolean = true) => {
  return isClickable ? (
    <Link
      to={to}
      style={{
        color: '#007bff',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  ) : (
    '_'
  );
};

const useTableColumns = (onDelete: () => void) => {
  const { t } = useTranslation('customer');
  const notify = useNotification();
  const navigate = useNavigate();
  const dialog = useDialog();

  const HEAD_CELLS: HeadCell<Customer> = {
    name: t('name'),
    order: t('customer_order'),
    customerNumber: t('customer_number'),
    transactions: t('customer_transaction'),
    customerAddress: t('address'),
    customerType: t('customer_type'),
    createdBy: t('author'),
    customerGroupId: t('customer_group'),
    customerServices: t('customer_services'),
    customerGroup: t('customer_group'),
    customerContact: t('contact_title'),
    actions: t('action'),
    createdAt: t('created_at'),
    postCode: t('post_code'),
    total_amount_collected: t('total_amount_collected'),
  };
  const onDeleteRow = ({ row }: ActionRowParams<Customer>) => {
    dialog({
      headline: t('delete_title'),
      supportingText: (
        <Fragment>
          {t('delete_confirm')} <strong>{row.original.name}</strong>
        </Fragment>
      ),
      onConfirm: async () => {
        try {
          await deleteCustomer(row.original.id!);
          onDelete();
          notify({
            message: `${t('delete_success')} ${row.original.name}`,
            severity: 'success',
          });
        } catch (error: any) {
          notify({
            message: error.message,
            severity: 'error',
          });
        }
      },
    });
  };

  const { actionColumn } = useBaseColumns<Customer, any>({
    onDelete: onDeleteRow,
    onEdit: ({ row }) => {
      navigate(`${ROUTE_PATH.CUSTOMERS_UPDATE}/${row.id}`);
    },
    key: 'customers',
  });
  const columns = useMemo(() => {
    return [
      Selection<Customer>(),
      columnHelper.accessor('code', {
        id: 'code',
        size: 200,
        header: () => HEAD_CELLS.customerNumber,
        cell: (context) => {
          const { id } = context.row.original;
          return createDetailLink(
            context.row.original.code,
            `${ROUTE_PATH.CUSTOMERS_UPDATE}/${id}`,
            true,
          );
        },
        meta: {
          title: HEAD_CELLS.customerNumber,
        },
      }),
      columnHelper.accessor('name', {
        id: 'name',
        size: 200,
        header: () => HEAD_CELLS.name,
        cell: (context) => context.row.original.name,
        meta: {
          title: HEAD_CELLS.name,
        },
      }),
      columnHelper.accessor('author', {
        id: 'createdBy',
        size: 200,
        header: () => HEAD_CELLS.createdBy,
        cell: (context) => {
          const { username } = context.row.original.author;
          return username;
        },
        meta: {
          title: HEAD_CELLS.createdBy,
        },
      }),
      columnHelper.accessor('customerGroup.name', {
        id: 'customerGroup',
        size: 200,
        header: () => HEAD_CELLS.customerGroup,
        cell: (context) => context.row.original.customerGroup?.name || '_',
        meta: {
          title: HEAD_CELLS.customerGroup,
        },
      }),
      columnHelper.accessor('customerType', {
        id: 'customerType',
        size: 150,
        header: () => HEAD_CELLS.customerType,
        cell: (context) => {
          const value = context.getValue();
          return value === 'CUSTOMER' ? t('customer') : value === 'AGENCY' ? t('agency') : value;
        },
        meta: {
          title: HEAD_CELLS.customerType,
        },
      }),

      actionColumn,
    ];
  }, [open, notify, t]);
  return { columns };
};

export default useTableColumns;
