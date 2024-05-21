import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import {
  formatsQuill,
  modulesQuill,
} from '@/shared/components/quill/quill.model';

import { EExamTipsType, IExamTipsResponse } from '../exam-tips.model';
import examTipsService from '../exam-tips.service';

type TExamTipsFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow: IExamTipsResponse;
  refetch?: () => Promise<any>;
};

const ExamTipsFormDrawer: React.FC<TExamTipsFormDrawerProps> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TExamTipsFormDrawerProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const setLoading = useAppStore((state) => state.setLoading);

  const Quill = ReactQuill.Quill;
  const Font = Quill.import('formats/font');
  Font.whitelist = ['Roboto', 'Raleway', 'Montserrat', 'Lato', 'Rubik'];
  Quill.register(Font, true);

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const createMutation = useMutation({
    mutationFn: (data: any) => examTipsService.create(data),
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
    mutationFn: (data: any) =>
      dataRow ? examTipsService.update(data) : (null as any),
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

  useEffect(() => {
    if (action === 'create') {
      form.setFieldsValue({
        description: [{ text: '' }],
        type: EExamTipsType.Part1,
      });
    } else {
      dataRow &&
        form.setFieldsValue({
          title: dataRow.title,
          type: dataRow.type,
          description: dataRow.description,
        });
    }
  }, [action, dataRow, form]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 23 },
      sm: { span: 19 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 23, offset: 0 },
      sm: { span: 19, offset: 4 },
    },
  };

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('mẹo làm bài').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('mẹo làm bài').toLowerCase()
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
        name="exam-tips-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => {
          setLoading(true);
          action === 'create'
            ? createMutation.mutate({
                ...values,
                creatorId: user?.id,
              })
            : updateMutation.mutate({
                ...values,
                creatorId: dataRow?.creatorId,
                id: dataRow.id,
              });
        }}
      >
        <Form.Item
          name="title"
          label={t('Tiêu đề')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label={t('Loại')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Select
            defaultValue={EExamTipsType.Part1}
            style={{ width: 120 }}
            options={[
              { value: EExamTipsType.Part1, label: t('Part') + ' 1' },
              { value: EExamTipsType.Part2, label: t('Part') + ' 2' },
              { value: EExamTipsType.Part3, label: t('Part') + ' 3' },
              { value: EExamTipsType.Part4, label: t('Part') + ' 4' },
              { value: EExamTipsType.Part5, label: t('Part') + ' 5' },
              { value: EExamTipsType.Part6, label: t('Part') + ' 6' },
              { value: EExamTipsType.Part7, label: t('Part') + ' 7' },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('Nội dung')}>
          <Form.List name="description">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    key={field.key}
                    style={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: t('Trường này không được bỏ trống!'),
                        },
                      ]}
                      style={{ marginBottom: 30 }}
                    >
                      <ReactQuill
                        theme="snow"
                        modules={modulesQuill}
                        formats={formatsQuill}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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

export default ExamTipsFormDrawer;
