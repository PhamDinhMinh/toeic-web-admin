import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Card,
  Flex,
  Input,
  Space,
  TablePaginationConfig,
  Typography,
} from 'antd';
import { useId, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import ExamPreviewDrawer from '@/modules/exams/components/exam-form-preview';
import ExamFormDrawer from '@/modules/exams/components/exams-form-drawer';
import ModalFormRandom from '@/modules/exams/components/modal-form-random';
import { IResponseExamAll } from '@/modules/exams/services/exams.model';
import examService from '@/modules/exams/services/exams.service';

export const Route = createFileRoute('/_app/exams/')({
  component: ExamTipsListPage,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: any;
  filters?: Record<string, any>;
};

function ExamTipsListPage() {
  const { antdApp } = useApp();
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));
  const [search, setSearch] = useState<string>('');
  const uid = useId();
  const setLoading = useAppStore((state) => state.setLoading);

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 1000,
    },
    filters: {
      keyword: search,
    },
    sortOrder: {
      orderBy: true,
    },
  });
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [dataRow, setDataRow] = useState<IResponseExamAll>();

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

  const { data: getExamList, refetch } = useQuery({
    queryKey: [
      '/exams-list',
      tableParams.pagination,
      tableParams.filters,
      tableParams.sortOrder,
    ],
    queryFn: () =>
      examService.getAll({
        maxResultCount: tableParams.pagination?.pageSize,
        skipCount: 0,
        ...tableParams.filters,
        ...tableParams.sortOrder,
      }),
  });

  const { mutate: deleteExam } = useMutation({
    mutationFn: (id: number) => examService.delete(id),
    onSuccess: () => {
      refetch();
      setLoading(false);
      antdApp.message.success(t('Xoá thành công'));
    },
    onError: () => {
      setLoading(false);
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

      <ExamPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={dataRow?.id ?? 0}
      />

      {openModal && (
        <ModalFormRandom openModal={openModal} setOpenModal={setOpenModal} />
      )}

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
              type="primary"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              {t('Tạo đề ngẫu nhiên')}
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

        <Flex wrap="wrap" gap="large" justify="start" style={{ width: '100%' }}>
          {getExamList?.data?.data?.map(
            (item: IResponseExamAll, index: number) => (
              <Card
                key={index + 'card-exam' + uid}
                style={{ marginBottom: 20 }}
                cover={
                  <img
                    alt="example"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-epQyS3GT2YSXiM_sXJhuWnE4W55dd5_O6A&s"
                    style={{ padding: 10 }}
                  />
                }
                actions={[
                  <EyeOutlined
                    key="watch"
                    onClick={() => {
                      setDataRow(item);
                      setOpenPreviewDrawer(true);
                    }}
                  />,
                  <EditOutlined
                    key="edit"
                    onClick={() => {
                      setFormMode('update');
                      setDataRow(item);
                      setOpenFormDrawer(true);
                    }}
                  />,
                  <DeleteOutlined
                    key="delete"
                    color="error"
                    onClick={() => {
                      antdApp.modal.confirm({
                        title: t('Xác nhận xoá'),
                        content: t('Bạn có chắc chắn muốn xoá không?'),
                        okText: t('Xác nhận'),
                        cancelText: t('Huỷ'),
                        onOk: async () => {
                          setLoading(true);
                          await deleteExam(item.id);
                        },
                      });
                    }}
                  />,
                ]}
                bodyStyle={{ padding: 0 }}
              >
                <Typography.Paragraph
                  style={{ paddingLeft: 10 }}
                  ellipsis={{ rows: 1, expandable: false }}
                >
                  {item?.nameExam}
                </Typography.Paragraph>
              </Card>
            ),
          )}
        </Flex>
      </Space>
    </>
  );
}

export default ExamTipsListPage;
