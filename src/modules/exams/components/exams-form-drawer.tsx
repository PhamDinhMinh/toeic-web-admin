import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Space } from 'antd';
import { useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import examService from '../services/exams.service';
import ButtonOpenModal from './button-open-modal';

type TExamFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow?: any;
  refetch?: () => Promise<any>;
};

const ExamFormDrawer: React.FC<TExamFormDrawerProps> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TExamFormDrawerProps) => {
  const { t } = useTranslation();
  const setLoading = useAppStore((state) => state.setLoading);

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const createMutation = useMutation({
    mutationFn: (data: any) => examService.create(data),
    onSuccess: async () => {
      setLoading(false);
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });
  //   queryKey: ['/question-single-list'],
  //   queryFn: () =>
  //     questionToeicService.getListSingleQuestion({
  //       maxResultCount: 100,
  //       skipCount: 0,
  //     }),
  // });

  // const option = useMemo(() => {
  //   return (
  //     getListSingleQuestion?.data?.data?.map(
  //       (item: IQuestionSingleResponse) => ({
  //         value: item.id,
  //         label: item.content,
  //       }),
  //     ) || []
  //   );
  // }, [getListSingleQuestion]);

  const itemPart = [
    {
      partId: EExamTipsType.Part1,
      name: 'listQuestionPart1',
      quantityQuestion: 6,
    },
    {
      partId: EExamTipsType.Part2,
      name: 'listQuestionPart2',
      quantityQuestion: 25,
    },
    {
      partId: EExamTipsType.Part3,
      name: 'listQuestionPart3',
      quantityQuestion: 39,
    },
    {
      partId: EExamTipsType.Part4,
      name: 'listQuestionPart4',
      quantityQuestion: 30,
    },
    {
      partId: EExamTipsType.Part5,
      name: 'listQuestionPart5',
      quantityQuestion: 30,
    },
    {
      partId: EExamTipsType.Part6,
      name: 'listQuestionPart6',
      quantityQuestion: 16,
    },
    {
      partId: EExamTipsType.Part7,
      name: 'listQuestionPart7',
      quantityQuestion: 54,
    },
  ];

  useEffect(() => {
    if (action === 'create') {
      //   form.setFieldsValue({
      //     description: [{ text: '' }],
      //     type: EExamType.Part1,
      //   });
    } else {
      dataRow &&
        form.setFieldsValue({
          title: dataRow.title,
          type: dataRow.type,
          description: dataRow.description,
        });
    }
  }, [action, dataRow, form]);

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('đề thi').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('đề thi').toLowerCase()
      }
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Đóng')}</Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
            disabled={createMutation.isPending}
            onClick={() => {
              form.submit();
              hiddenSubmitRef.current.click();
            }}
          >
            {t('Xác nhận')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="exam-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => {
          setLoading(true);
          console.log(values, 'jjj');
          // action === 'create'
          //   ? createMutation.mutate({
          //       ...values,
          //     })
          //   : '';
        }}
      >
        <Form.Item
          name="title"
          label={t('Tên đề thi')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Input />
        </Form.Item>

        {itemPart?.map((item) => (
          <>
            <Form.Item
              name={item.name}
              label={t('Câu hỏi part') + ' ' + item.partId}
              rules={[
                {
                  required: true,
                  validator: async (_, listPart) => {
                    if (
                      !listPart ||
                      listPart.length !== item.quantityQuestion
                    ) {
                      return Promise.reject(
                        new Error(
                          t('Part') +
                            ' ' +
                            item.partId +
                            ' ' +
                            'phải có' +
                            ' ' +
                            item.quantityQuestion +
                            ' ' +
                            t('Câu hỏi').toLowerCase(),
                        ),
                      );
                    }
                  },
                },
              ]}
            >
              <ButtonOpenModal
                partId={item.partId}
                name={item.name}
                form={form}
              />
            </Form.Item>
          </>
        ))}

        <Form.Item shouldUpdate>
          {() => (
            <button
              type="submit"
              style={{ display: 'none' }}
              ref={hiddenSubmitRef}
            />
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ExamFormDrawer;
