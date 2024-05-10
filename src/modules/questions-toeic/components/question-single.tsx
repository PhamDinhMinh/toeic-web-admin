import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { useCallback, useId, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import PartTypeTag from '@/modules/exam-tips/components/part-type-tag';

import questionToeicService from '../services/question-toeic.service';
import QuestionSingleFormDrawer from './question-single-form-drawer';
import QuestionSinglePreviewDrawer from './question-single-preview-drawer';
import TypePartTypeTag from './type-part-type-tag';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function QuestionSingle() {
  const { antdApp } = useApp();

  const uid = useId();
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

  const [stateOpen, setStateOpen] = useState({
    openSingleFormDrawer: false,
    openViewFormDrawer: false,
  });

  const [dataRow, setDataRow] = useState<any>();
  const [search, setSearch] = useState<string>('');

  const setOpenSingleFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openSingleFormDrawer: item }));
  }, []);

  const setOpenViewFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openViewFormDrawer: item }));
  }, []);

  const {
    data: getListSingleQuestion,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      '/question-single-list',
      tableParams.pagination,
      tableParams.filters,
    ],
    queryFn: () =>
      questionToeicService.getListSingleQuestion({
        maxResultCount: tableParams.pagination?.pageSize || 10,
        skipCount:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
      }),
  });

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
      {stateOpen.openSingleFormDrawer && (
        <QuestionSingleFormDrawer
          open={stateOpen.openSingleFormDrawer}
          setOpen={setOpenSingleFormDrawer}
          action="update"
          dataRow={dataRow}
          refetch={refetch}
        />
      )}

      {stateOpen.openViewFormDrawer && (
        <QuestionSinglePreviewDrawer
          open={stateOpen.openViewFormDrawer}
          setOpen={setOpenViewFormDrawer}
          dataRow={dataRow}
        />
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="flex-end">
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
          dataSource={getListSingleQuestion?.data?.data || []}
          pagination={tableParams.pagination}
          rowKey={(record) => record.id}
          bordered
          columns={[
            {
              title: t('STT'),
              key: 'index',
              width: 40,
              render: (_, __, index) => {
                const currentPage = tableParams.pagination.current || 1;
                const pageSize = tableParams.pagination.pageSize || 10;
                return (currentPage - 1) * pageSize + index + 1;
              },
            },
            {
              title: t('Nội dung'),
              dataIndex: 'content',
              key: 'content',
              width: 200,
            },
            {
              title: t('Phần thi'),
              dataIndex: 'partId',
              key: 'partId',
              width: 20,
              render: (type: number) => <PartTypeTag type={type} />,
            },
            {
              title: t('Loại'),
              dataIndex: 'type',
              key: 'type',
              render: (type, item, index) => (
                <TypePartTypeTag
                  partId={item?.partId}
                  type={type}
                  key={index + uid}
                />
              ),
            },
            {
              title: t('Đáp án'),
              dataIndex: 'answers',
              key: 'answers',
              render: (answers) => (
                <div>
                  {answers.map((answer: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        color: answer.isBoolean ? '#00FF00' : 'inherit',
                      }}
                    >
                      {String.fromCharCode(65 + index)}: {answer.content}
                    </div>
                  ))}
                </div>
              ),
              width: 200,
            },
            {
              title: t('Giải thích'),
              dataIndex: 'transcription',
              key: 'transcription',
              width: 200,
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
                          setOpenViewFormDrawer(true);
                        },
                      },
                      {
                        label: t('Chỉnh sửa'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setDataRow(record);
                          setOpenSingleFormDrawer(true);
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
                            onOk: async () => {},
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

export default QuestionSingle;
