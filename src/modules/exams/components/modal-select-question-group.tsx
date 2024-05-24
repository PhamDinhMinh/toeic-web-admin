import { useQuery } from '@tanstack/react-query';
import {
  Flex,
  Image,
  Input,
  Space,
  Table,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { useId, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDebounce } from 'react-use';

import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import PartTypeTag from '@/modules/exam-tips/components/part-type-tag';
import TypePartTypeTag from '@/modules/questions-toeic/components/type-part-type-tag';
import questionToeicService from '@/modules/questions-toeic/services/question-toeic.service';

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
  partId?: number;
};

function ModalSelectQuestionGroup({
  partId,
  setSelectedRowKeys,
  selectedRowKeys,
  setRowData,
}: {
  partId: number;
  setSelectedRowKeys: any;
  selectedRowKeys: React.Key[];
  setRowData?: any;
}) {
  const uid = useId();
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
    filters: {
      keyword: '',
    },
  });

  const [search, setSearch] = useState<string>('');

  const onSelectChange = (newSelectedRowKeys: React.Key[], rowData: any) => {
    setRowData(rowData);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys && selectedRowKeys?.length > 0;

  const {
    data: getListGroupQuestion,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      '/question-group-list',
      tableParams.pagination,
      tableParams.filters,
      partId,
    ],
    queryFn: () =>
      questionToeicService.getListGroupQuestion({
        maxResultCount: tableParams.pagination?.pageSize || 20,
        skipCount:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
        partId: partId,
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
      <Space
        direction="vertical"
        style={{
          width: '100%',
          height: 540,
          overflow: 'scroll',
          marginTop: 1,
        }}
      >
        <Flex justify="space-between" align="center">
          <Typography style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </Typography>
          <Space>
            <Input.Search
              placeholder={t('Tìm kiếm')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Space>
        </Flex>

        <Table
          loading={isLoading || isFetching}
          dataSource={getListGroupQuestion?.data?.data || []}
          pagination={{
            ...tableParams.pagination,
            total: getListGroupQuestion?.data?.totalRecords ?? 0,
          }}
          rowSelection={rowSelection}
          rowKey={(record) => record.id}
          bordered
          scroll={{ x: 2200 }}
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
              render: (imageUrl) =>
                imageUrl.map((image: string) => (
                  <>
                    <Image width={250} src={image} />
                  </>
                )),
              hidden: partId === 3 || partId === 4,
            },
            {
              title: t('File nghe'),
              dataIndex: 'audioUrl',
              key: 'audioUrl',
              width: 350,
              render: (audioUrl) => (
                <>
                  {audioUrl && (
                    <AudioPlayer
                      style={{ borderRadius: '1rem' }}
                      src={audioUrl}
                      showSkipControls={false}
                      showJumpControls={false}
                      preload="none"
                    />
                  )}
                </>
              ),
              hidden: partId === 6 || partId === 7,
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
                      <Space style={gridStyle}>{t('Dạng câu')}</Space>
                      <Space style={{ ...gridStyle, minWidth: 100 }}>
                        {t('Nội dung')}
                      </Space>
                      <Space style={gridStyle}>{t('Đáp án')}</Space>
                      <Space style={gridStyle}>{t('Giải thích')}</Space>
                    </Flex>
                    {questions.map((item: any, index: number) => (
                      <>
                        <Flex style={{ width: '100%' }}>
                          <Space style={gridStyle}>
                            <TypePartTypeTag
                              partId={rowData.partId}
                              type={item.type}
                              key={index + uid}
                            />
                          </Space>
                          <Space
                            style={{
                              ...gridStyle,
                              minWidth: 100,
                            }}
                          >
                            {item.content ?? ''}
                          </Space>
                          <Flex style={gridStyle} vertical>
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
                          <Space style={gridStyle}>
                            {item.transcription ?? ''}
                          </Space>
                        </Flex>
                      </>
                    ))}
                  </div>
                );
              },
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

export default ModalSelectQuestionGroup;

const gridStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #E0E0E0',
  padding: '6px',
};
