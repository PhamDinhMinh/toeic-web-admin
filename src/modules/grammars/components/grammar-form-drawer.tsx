import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { useAuthStore } from '@/modules/auth/auth.zustand';

import { EGrammarType, IGrammarResponse } from '../grammars.model';
import grammarService from '../grammars.service';

type TGrammarFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow: IGrammarResponse;
  refetch?: () => Promise<any>;
};

const GrammarFormDrawer: React.FC<TGrammarFormDrawerProps> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TGrammarFormDrawerProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const setLoading = useAppStore((state) => state.setLoading);

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
            '#24d0b1',
            '#24d0a3',
            '#24d094',
            '#24d086',
            '#24d078',
            '#24d069',
            '#24d05b',
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
    mutationFn: (data: any) => grammarService.create(data),
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
      dataRow ? grammarService.update(data) : (null as any),
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
      form.resetFields();
    } else {
      dataRow &&
        form.setFieldsValue({
          title: dataRow.title,
          type: dataRow.type,
          content: dataRow.content,
        });
    }
  }, [action, dataRow, form]);

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('chủ đề').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('chủ đề').toLowerCase()
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
        name="grammar-form"
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

        <Form.Item name="type" label={t('Loại')}>
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            options={[
              { value: EGrammarType.BASIC, label: t('Cơ bản') },
              { value: EGrammarType.ADVANCED, label: t('Nâng cao') },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={t('Nội dung')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <ReactQuill theme="snow" modules={modules} formats={formats} />
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

export default GrammarFormDrawer;
