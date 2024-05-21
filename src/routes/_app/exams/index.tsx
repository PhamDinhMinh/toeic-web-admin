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
import ExamTipsPreviewDrawer from '@/modules/exam-tips/components/exam-tips-preview-drawer';
import examTipsService from '@/modules/exam-tips/exam-tips.service';
import ExamFormDrawer from '@/modules/exams/components/exams-form-drawer';

export const Route = createFileRoute('/_app/exams/')({
  component: ExamTipsListPage,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function ExamTipsListPage() {
  const { antdApp } = useApp();
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));
  const [search, setSearch] = useState<string>('');

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      keyword: search,
    },
  });
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<any>();

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
    queryKey: ['/exam-list', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      examTipsService.getList({
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
    mutationFn: (id: number) => examTipsService.delete(id),
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
      <ExamFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        dataRow={dataRow}
        refetch={refetch}
      />

      <ExamTipsPreviewDrawer
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
          pagination={{
            ...tableParams.pagination,
            total: getListGrammarQuery?.data?.totalRecords ?? 0,
          }}
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
              title: t('Hành động'),
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

export default ExamTipsListPage;
