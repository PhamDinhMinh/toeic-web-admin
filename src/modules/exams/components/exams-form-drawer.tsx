import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import { IQuestionSingleResponse } from '@/modules/questions-toeic/services/question-toeic.model';
import questionToeicService from '@/modules/questions-toeic/services/question-toeic.service';

import examService from '../services/exams.service';

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
  const user = useAuthStore((state) => state.user);
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

  const { data: getListSingleQuestion } = useQuery({
    queryKey: ['/question-single-list'],
    queryFn: () =>
      questionToeicService.getListSingleQuestion({
        maxResultCount: 100,
        skipCount: 0,
      }),
  });

  const option = useMemo(() => {
    return (
      getListSingleQuestion?.data?.data?.map(
        (item: IQuestionSingleResponse) => ({
          value: item.id,
          label: item.content,
        }),
      ) || []
    );
  }, [getListSingleQuestion]);

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
          action === 'create'
            ? createMutation.mutate({
                ...values,
              })
            : '';
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

        <Form.Item
          name="listQuestionPart1"
          label={t('Câu hỏi part1')}
          rules={[
            {
              required: true,
              validator: async (_, listQuestionPart1) => {
                if (!listQuestionPart1 || listQuestionPart1.length > 6) {
                  return Promise.reject(
                    new Error(t('Part 1 chỉ có 6 câu hỏi')),
                  );
                }
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các câu hỏi"
            options={option}
            // optionRender={(option) => (
            //   <Space>
            //     <span role="img" aria-label={option.data.label}>
            //       {option.data.emoji}
            //     </span>
            //     {option.data.desc}
            //   </Space>
            // )}
          />
        </Form.Item>

        <Form.Item
          name="listQuestionPart2"
          label={t('Câu hỏi part2')}
          rules={[
            {
              required: true,
              validator: async (_, listQuestionPart1) => {
                if (!listQuestionPart1 || listQuestionPart1.length > 25) {
                  return Promise.reject(
                    new Error(t('Part 2 chỉ có 25 câu hỏi')),
                  );
                }
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các câu hỏi"
            options={option}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.emoji}
                </span>
                {option.data.desc}
              </Space>
            )}
          />
        </Form.Item>

        <Form.Item
          name="listQuestionPart5"
          label={t('Câu hỏi part5')}
          rules={[
            {
              required: true,
              validator: async (_, listQuestionPart1) => {
                if (!listQuestionPart1 || listQuestionPart1.length > 30) {
                  return Promise.reject(
                    new Error(t('Part 5 chỉ có 30 câu hỏi')),
                  );
                }
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các câu hỏi"
            options={option}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.emoji}
                </span>
                {option.data.desc}
              </Space>
            )}
          />
        </Form.Item>

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
