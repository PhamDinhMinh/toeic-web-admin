import { useMutation, useQuery } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Skeleton, Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import estateService from '../estate.service';

type TEstateFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const EstateFormDrawer: React.FC<TEstateFormDrawerProps> = ({
  open,
  setOpen,
  action,
  id,
  refetch,
}: TEstateFormDrawerProps) => {
  const { t } = useTranslation();

  const Quill = ReactQuill.Quill;
  const Font = Quill.import('formats/font');
  Font.whitelist = ['Roboto', 'Raleway', 'Montserrat', 'Lato', 'Rubik'];
  Quill.register(Font, true);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
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

  const getQuery = useQuery({
    queryKey: ['/estates/detail', id],
    enabled: !!id,
    queryFn: () => (id ? estateService.getDetail(id) : undefined),
  });

  // useEffect(() => {
  //   if (getQuery.data) {
  //     const project = getQuery.data.data;
  //   }
  // }, [getQuery.data, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => estateService.create(data),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Created successfully'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      id ? estateService.update(id, data) : (null as any),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Updated successfully'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    }
  }, [action, form]);

  return (
    <Drawer
      title={action === 'create' ? t('Create new') : t('Update') + t('Estate')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={getQuery.isLoading}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Submit')}
          </Button>
        </Space>
      }
    >
      {getQuery.isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="estates-form"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            action === 'create'
              ? createMutation.mutate({
                  ...values,
                })
              : updateMutation.mutate({
                  ...values,
                  id,
                });
          }}
        >
          <Form.Item name="name" label={t('Name')} required>
            <Input />
          </Form.Item>

          <Form.Item name="description" label={t('Description')}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="description" label={t('Description')}>
            <ReactQuill theme="snow" modules={modules} formats={formats} />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default EstateFormDrawer;
