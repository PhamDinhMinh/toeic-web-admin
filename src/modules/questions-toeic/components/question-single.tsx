import { TablePaginationConfig } from 'antd';
import { useId, useState } from 'react';
import { useDebounce } from 'react-use';

import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import GrammarPreviewDrawer from '@/modules/grammars/components/grammar-preview-drawer';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function QuestionSingle() {
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      roles: [],
    },
  });
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const uid = useId();

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
        filters: {
          keyword: search,
        },
      });
    },
    1000,
    [search],
  );

  return (
    <>
      <GrammarPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        dataRow={dataRow}
      />
    </>
  );
}

export default QuestionSingle;
