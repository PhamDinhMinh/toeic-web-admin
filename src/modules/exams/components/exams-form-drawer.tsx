import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Space, Typography } from 'antd';
import { useEffect, useId, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import { IResponseExamAll } from '../services/exams.model';
import examService from '../services/exams.service';
import ButtonOpenModal from './button-open-modal';

type TExamFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow?: IResponseExamAll;
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
  const uid = useId();
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

  const updateMutation = useMutation({
    mutationFn: (data: any) => examService.update(data),
    onSuccess: async () => {
      setLoading(false);
      refetch && (await refetch());
      message.success(t('Chỉnh sửa thành công'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

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
      form.resetFields();
    } else {
      dataRow &&
        form.setFieldsValue({
          nameExam: dataRow.nameExam,
          listQuestionPart1: dataRow.listQuestionPart1,
          listQuestionPart2: dataRow.listQuestionPart2,
          listQuestionPart3: dataRow.listQuestionPart3,
          listQuestionPart4: dataRow.listQuestionPart4,
          listQuestionPart5: dataRow.listQuestionPart5,
          listQuestionPart6: dataRow.listQuestionPart6,
          listQuestionPart7: dataRow.listQuestionPart7,
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
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={createMutation.isPending || updateMutation.isPending}
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
            : updateMutation.mutate({ ...values, id: dataRow?.id });
        }}
      >
        <Form.Item
          name="nameExam"
          label={t('Tên đề thi')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Input />
        </Form.Item>

        {itemPart?.map((item, index) => (
          <Form.Item
            key={index + 'part' + uid}
            name={item.name}
            label={t('Câu hỏi part') + ' ' + item.partId}
            rules={[
              {
                required: true,
                validator: async (_, listPart) => {
                  if (
                    (!listPart || listPart.length !== item.quantityQuestion) &&
                    (item.partId === 1 ||
                      item.partId === 5 ||
                      item.partId === 2)
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
                  if (
                    (!listPart ||
                      listPart.length !== item.quantityQuestion / 3) &&
                    (item.partId === 3 || item.partId === 4)
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
                  if (
                    (!listPart ||
                      listPart.length !== item.quantityQuestion / 4) &&
                    item.partId === 6
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
                  if (
                    (!listPart || listPart.length !== 15) &&
                    item.partId === 7
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
        ))}
        <Typography.Text style={{ color: '#fadb14' }}>
          Chú ý: Vui lòng chọn part 7 theo yêu cầu sau: 4 nhóm 2 câu, 3 nhóm 3
          câu, 3 nhóm 4 câu, 5 nhóm 5 câu. Xin cảm ơn!
        </Typography.Text>

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
