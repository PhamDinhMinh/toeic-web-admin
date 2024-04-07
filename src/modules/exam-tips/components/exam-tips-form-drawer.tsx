import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAuthStore } from '@/modules/auth/auth.zustand';

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

  const Quill = ReactQuill.Quill;
  const Font = Quill.import('formats/font');
  Font.whitelist = ['Roboto', 'Raleway', 'Montserrat', 'Lato', 'Rubik'];
  Quill.register(Font, true);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        {
          color: [
            '#9edc7a',
            '#86d45a',
            '#6fcc3a',
            '#60bb32',
            '#4aa728',
            '#33931e',
            '#204918',
            '#FFD699',
            '#FFC166',
            '#FFAD33',
            '#FF9800',
            '#CC7A00',
            '#995B00',
            '#663D00',
            '#EEEEEE',
            '#E0E0E0',
            '#BDBDBD',
            '#9E9E9E',
            '#757575',
            '#616161',
            '#424242',
            '#B4A9FF',
            '#8E7FFF',
            '#6954FF',
            '#4329FF',
            '#3621CC',
            '#281999',
            '#1B1066',
            '#C199FF',
            '#A366FF',
            '#8433FF',
            '#6500FF',
            '#5100CC',
            '#3D0099',
            '#280066',
            '#F5A89A',
            '#EE7C6B',
            '#E54646',
            '#DF0029',
            '#C50023',
            '#FFFFFF',
            '#000000',
          ],
        },
        {
          background: [
            '#9edc7a',
            '#86d45a',
            '#6fcc3a',
            '#60bb32',
            '#4aa728',
            '#33931e',
            '#204918',
            '#FFD699',
            '#FFC166',
            '#FFAD33',
            '#FF9800',
            '#CC7A00',
            '#995B00',
            '#663D00',
            '#EEEEEE',
            '#E0E0E0',
            '#BDBDBD',
            '#9E9E9E',
            '#757575',
            '#616161',
            '#424242',
            '#B4A9FF',
            '#8E7FFF',
            '#6954FF',
            '#4329FF',
            '#3621CC',
            '#281999',
            '#1B1066',
            '#C199FF',
            '#A366FF',
            '#8433FF',
            '#6500FF',
            '#5100CC',
            '#3D0099',
            '#280066',
            '#F5A89A',
            '#EE7C6B',
            '#E54646',
            '#DF0029',
            '#C50023',
            '#FFFFFF',
            '#000000',
          ],
        },
      ],
      [{ align: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['image'],
      [{ script: 'sub' }, { script: 'super' }],
    ],
  };

  const formats = [
    'header',
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'color',
    'background',
    'code',
    'script',
    'list',
    'bullet',
    'indent',
    'image',
  ];

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const createMutation = useMutation({
    mutationFn: (data: any) => examTipsService.create(data),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      dataRow ? examTipsService.update(data) : (null as any),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Chỉnh sửa thành công'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
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
            {(fields, { add, remove }, { errors }) => (
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
                        modules={modules}
                        formats={formats}
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
