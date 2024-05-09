import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { Popover, Typography } from 'antd/lib';
import { useId, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import GrammarFormDrawer from '@/modules/grammars/components/grammar-form-drawer';
import GrammarPreviewDrawer from '@/modules/grammars/components/grammar-preview-drawer';
import GrammarTypeTag from '@/modules/grammars/components/grammar-type-tag';
import grammarService from '@/modules/grammars/grammars.service';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function QuestionGroup() {
  const { antdApp, isDarkTheme } = useApp();
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
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
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

  const {
    data: getListGrammarQuery,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['/grammar-list', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      grammarService.getList({
        maxResultCount: tableParams.pagination?.pageSize || 10,
        skipCount:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
      }),
  });

  const deleteEstateMutation = useMutation({
    mutationFn: (id: number) => grammarService.delete(id),
    onSuccess: () => {
      refetch();
      antdApp.message.success(t('Xoá thành công'));
    },
    onError: () => {
      antdApp.message.error(t('Xoá thất bại'));
    },
  });

  return (
    <>
      <GrammarFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        dataRow={dataRow}
        refetch={refetch}
      />

      <GrammarPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        dataRow={dataRow}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setOpenFormDrawer(true);
                setFormMode('create');
              }}
            >
              {t('Tạo mới')}
            </Button>
          </Space>

          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              <Input.Search
                placeholder={t('Tìm kiếm')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={isLoading || isFetching}
          dataSource={getListGrammarQuery?.data?.data || []}
          pagination={tableParams.pagination}
          rowKey={(record) => record.id}
          bordered
          columns={[
            {
              title: t('STT'),
              key: 'index',
              width: 50,
              render: (_, __, index) => {
                const currentPage = tableParams.pagination.current || 1;
                const pageSize = tableParams.pagination.pageSize || 10;
                return (currentPage - 1) * pageSize + index + 1;
              },
            },
            {
              title: t('Tiêu đề'),
              dataIndex: 'title',
              key: 'title',
              width: 200,
            },
            {
              title: t('Loại'),
              dataIndex: 'type',
              key: 'type',
              width: 100,
              render: (type: number) => <GrammarTypeTag type={type} />,
            },
            {
              title: t('Nội dung'),
              dataIndex: 'content',
              key: 'content',
              render: (content) => (
                <div>
                  <div
                    style={{
                      maxHeight: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  <Popover
                    content={
                      <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{
                          maxHeight: '300px',
                          overflow: 'auto',
                          maxWidth: '500px',
                        }}
                      />
                    }
                    trigger="click"
                  >
                    <Typography
                      style={{
                        cursor: 'pointer',
                        color: isDarkTheme ? 'white' : 'black',
                      }}
                    >
                      Xem thêm...
                    </Typography>
                  </Popover>
                </div>
              ),
            },
            {
              key: 'actions',
              fixed: 'right',
              width: 100,
              render: (_, record) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: t('Xem'),
                        key: 'view',
                        icon: <EyeOutlined />,
                        onClick: () => {
                          setDataRow(record);
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: t('Chỉnh sửa'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setFormMode('update');
                          setDataRow(record);
                          setOpenFormDrawer(true);
                        },
                      },
                      {
                        label: t('Xoá'),
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                          antdApp.modal.confirm({
                            title: t('Xác nhận xoá'),
                            content: t('Bạn có chắc chắn muốn xoá không?'),
                            okText: t('Xác nhận'),
                            cancelText: t('Huỷ'),
                            onOk: async () => {
                              await deleteEstateMutation.mutateAsync(
                                +record.id,
                              );
                            },
                          });
                        },
                      },
                    ],
                  }}
                >
                  <Button>
                    <Space>
                      {t('Hành động')}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              ),
            },
          ]}
          onChange={(pagination) => {
            setTableParams({
              ...tableParams,
              pagination,
            });
          }}
        />
      </Space>
    </>
  );
}

export default QuestionGroup;
