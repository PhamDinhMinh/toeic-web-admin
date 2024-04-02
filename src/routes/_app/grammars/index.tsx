import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import EstatePreviewDrawer from '@/modules/estates/components/estate-preview-drawer';
import EstateTypeTag from '@/modules/estates/components/estate-type-tag';
import { EEstateType } from '@/modules/estates/estate.model';
import projectService from '@/modules/estates/estate.service';
import estateService from '@/modules/estates/estate.service';
import GrammarFormDrawer from '@/modules/grammars/components/estate-form-drawer';

export const Route = createFileRoute('/_app/grammars/')({
  component: GrammarListPage,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function GrammarListPage() {
  const { antdApp } = useApp();
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
  const [formId, setFormId] = useState<number | undefined>();
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState<string>('');

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
        filters: {
          search: search,
        },
      });
    },
    1000,
    [search],
  );

  const getEstatesQuery = useQuery({
    queryKey: ['/estates', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      projectService.getList({
        take: tableParams.pagination?.pageSize || 10,
        skip:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
        sort: tableParams.sortField,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const deleteEstateMutation = useMutation({
    mutationFn: (id: number) => estateService.delete(id),
    onSuccess: () => {
      getEstatesQuery.refetch();
      antdApp.message.success(t('Xoá thành công'));
    },
    onError: () => {
      antdApp.message.error(t('Xoá thất bại'));
    },
  });

  const deleteManyEstatesMutation = useMutation({
    mutationFn: (ids: number[]) => estateService.deleteMany(ids),
    onSuccess: () => {
      getEstatesQuery.refetch();
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
        id={formId}
        refetch={getEstatesQuery.refetch}
      />

      <EstatePreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
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

            <Button
              danger
              type="dashed"
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                antdApp.modal.confirm({
                  title: t('Xác nhận xoá'),
                  content: t('Bạn có chắc chắn muốn xoá không?'),
                  okText: t('Xác nhận'),
                  cancelText: t('Huỷ'),
                  onOk: async () => {
                    await deleteManyEstatesMutation.mutateAsync(
                      selectedRowKeys.map((key) => +key.toString()),
                    );
                  },
                });
              }}
            >
              {t('Xoá đã chọn')}
            </Button>
          </Space>

          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              {/* <Popover
                  placement="bottomRight"
                  trigger="click"
                  title={t('Filter')}
                  content={
                    <UsersFilterForm
                      onSubmit={(values: any) => {
                        setTableParams({
                          ...tableParams,
                          filters: values,
                        });
                      }}
                    />
                  }
                >
                  <Button icon={<FilterOutlined />}>{t('Filter')}</Button>
                </Popover> */}

              <Input.Search
                placeholder={t('Tìm kiếm')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={getEstatesQuery.isLoading || getEstatesQuery.isFetching}
          dataSource={getEstatesQuery.data?.data.items || []}
          pagination={tableParams.pagination}
          rowKey={(record) => record.id}
          bordered
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          columns={[
            {
              title: t('STT'),
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: t('Tiêu đề'),
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: t('Loại'),
              dataIndex: 'type',
              key: 'type',
              render: (type: EEstateType) => <EstateTypeTag type={type} />,
            },
            {
              title: t('Nội dung'),
              dataIndex: 'type',
              key: 'type',
              render: (type: EEstateType) => <EstateTypeTag type={type} />,
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
                          setSelectedId(record.id);
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: t('Chỉnh sửa'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setFormMode('update');
                          setFormId(record.id);
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

export default GrammarListPage;
