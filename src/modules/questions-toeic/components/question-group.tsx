import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Dropdown,
  Flex,
  Image,
  Input,
  Popover,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import { useCallback, useId, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import PartTypeTag from '@/modules/exam-tips/components/part-type-tag';

import questionToeicService from '../services/question-toeic.service';
import QuestionFilterForm from './question-filter-form';
import QuestionGroupFormDrawer from './question-group-form-drawer';
import QuestionGroupPreviewDrawer from './question-group-preview-drawer';
import TypePartTypeTag from './type-part-type-tag';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function QuestionGroup() {
  const { antdApp } = useApp();
  const { t } = useTranslation();
  const uid = useId();

  useAppTitle(t('Xác nhận'));

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      keyword: '',
    },
  });

  const [stateOpen, setStateOpen] = useState({
    openFormDrawer: false,
    openViewFormDrawer: false,
  });
  const [dataRow, setDataRow] = useState<any>();
  const [search, setSearch] = useState<string>('');

  const setOpenFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openFormDrawer: item }));
  }, []);

  const setOpenViewFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openViewFormDrawer: item }));
  }, []);

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
    data: getListGroupQuestion,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      '/question-group-list',
      tableParams.pagination,
      tableParams.filters,
    ],
    queryFn: () =>
      questionToeicService.getListGroupQuestion({
        maxResultCount: tableParams.pagination?.pageSize || 10,
        skipCount:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
      }),
  });

  return (
    <>
      {stateOpen.openFormDrawer && (
        <QuestionGroupFormDrawer
          open={stateOpen.openFormDrawer}
          setOpen={setOpenFormDrawer}
          action="update"
          dataRow={dataRow}
          refetch={refetch}
        />
      )}

      {stateOpen.openViewFormDrawer && (
        <QuestionGroupPreviewDrawer
          open={stateOpen.openViewFormDrawer}
          setOpen={setOpenViewFormDrawer}
          dataRow={dataRow}
        />
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="flex-end">
          <Popover
            placement="bottomRight"
            trigger="click"
            title={t('Lọc')}
            content={
              <QuestionFilterForm
                onSubmit={(values: any) => {
                  setTableParams({
                    ...tableParams,
                    filters: values,
                  });
                }}
              />
            }
          >
            <Button icon={<FilterOutlined />} style={{ marginRight: 10 }}>
              {t('Lọc')}
            </Button>
          </Popover>
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
          dataSource={getListGroupQuestion?.data?.data || []}
          pagination={{
            ...tableParams.pagination,
            total: getListGroupQuestion?.data?.totalRecords ?? 0,
          }}
          rowKey={(record) => record.id}
          bordered
          scroll={{ x: 2650 }}
          columns={[
            {
              title: t('STT'),
              key: 'index',
              fixed: 'left',
              width: 70,
              render: (_, __, index) => {
                const currentPage = tableParams.pagination.current || 1;
                const pageSize = tableParams.pagination.pageSize || 10;
                return (currentPage - 1) * pageSize + index + 1;
              },
            },
            {
              title: t('Ảnh'),
              dataIndex: 'imageUrl',
              width: 300,
              key: 'title',
              render: (imageUrl) => (
                <>
                  {imageUrl?.length === 0 && 'Không có ảnh'}
                  {imageUrl.map((image: string) => (
                    <>
                      <Image width={250} src={image} />
                    </>
                  ))}
                </>
              ),
            },
            {
              title: t('File nghe'),
              dataIndex: 'audioUrl',
              key: 'audioUrl',
              width: 350,
              render: (audioUrl) => (
                <>
                  {audioUrl ? (
                    <AudioPlayer
                      style={{ borderRadius: '1rem' }}
                      src={audioUrl}
                      showSkipControls={false}
                      showJumpControls={false}
                      preload="none"
                    />
                  ) : (
                    'Không có audio'
                  )}
                </>
              ),
            },
            {
              title: t('Nội dung'),
              dataIndex: 'content',
              key: 'content',
              width: 350,
              render: (content) => (
                <>
                  {' '}
                  {content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: content }}
                      style={{ maxHeight: 320, overflow: 'scroll' }}
                    />
                  ) : (
                    'Không có nội dung câu hỏi'
                  )}
                </>
              ),
            },
            {
              title: t('Phần thi'),
              dataIndex: 'partId',
              width: 100,
              key: 'partId',
              render: (partId: number) => <PartTypeTag type={partId} />,
            },
            {
              title: t('Thuộc đề'),
              dataIndex: 'idExam',
              width: 100,
              key: 'idExam',
            },
            {
              title: t('Câu hỏi'),
              dataIndex: 'questions',
              key: 'questions',
              render: (questions, rowData) => {
                return (
                  <div style={{}}>
                    <Flex style={{ width: '100%' }}>
                      <Space style={{ ...gridStyle, maxWidth: 300 }}>
                        {t('Dạng câu')}
                      </Space>
                      <Space style={{ ...gridStyle, minWidth: 100 }}>
                        {t('Nội dung')}
                      </Space>
                      <Space style={gridStyle}>{t('Đáp án')}</Space>
                      <Space style={gridStyle}>{t('Giải thích')}</Space>
                    </Flex>
                    {questions.map((item: any, index: number) => (
                      <>
                        <Flex style={{ width: '100%' }}>
                          <Space style={{ ...gridStyle, overflow: 'scroll' }}>
                            <TypePartTypeTag
                              partId={rowData.partId}
                              type={item.type}
                              key={index + uid}
                            />
                          </Space>
                          <Flex
                            style={{
                              ...gridStyle,
                              minWidth: 100,
                              maxHeight: 200,
                              overflow: 'scroll',
                              border: '1px solid #E0E0E0',
                            }}
                          >
                            {item.content ?? ''}
                          </Flex>
                          <Flex
                            style={{
                              ...gridStyle,
                              minWidth: 100,
                              maxHeight: 200,
                              padding: '6px',
                            }}
                            vertical
                            justify="center"
                          >
                            {item?.answers.map((answer: any, index: number) => (
                              <div
                                key={index}
                                style={{
                                  color: answer.isBoolean
                                    ? 'rgb(36, 208, 163)'
                                    : 'inherit',
                                }}
                              >
                                {String.fromCharCode(65 + index)}:{' '}
                                {answer.content ?? ''}
                              </div>
                            ))}
                          </Flex>
                          <Flex
                            style={{
                              maxHeight: 200,
                              overflowY: 'scroll',
                              width: '100%',
                              height: '100%',
                              border: '1px solid #E0E0E0',
                              padding: '6px',
                            }}
                          >
                            {item.transcription ?? ''}
                          </Flex>
                        </Flex>
                      </>
                    ))}
                  </div>
                );
              },
            },

            {
              title: t('Hành động'),
              key: 'actions',
              fixed: 'right',
              width: 150,
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

export default QuestionGroup;

const gridStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #E0E0E0',
  padding: '6px',
};
