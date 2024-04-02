import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
} from 'antd';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import estateService from '@/modules/estates/estate.service';

type TEstateFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const GrammarFormDrawer: React.FC<TEstateFormDrawerProps> = ({
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
      id ? estateService.update(id, data) : (null as any),
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
      form.resetFields();
    }
  }, [action, form]);

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('Ngữ pháp').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('Ngữ pháp').toLowerCase()
      }
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Đóng')}</Button>

          <Button
            type="primary"
            loading={createMutation.isPending || updateMutation.isPending}
            disabled={getQuery.isLoading}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Xác nhận')}
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
            // action === 'create'
            //   ? createMutation.mutate({
            //       ...values,
            //     })
            //   : updateMutation.mutate({
            //       ...values,
            //       id,
            //     });
            console.log(
              values,
              'Xem dữ liệu gửi lên sẽ là như thế nào nhỉ hih',
            );
          }}
        >
          <Form.Item name="title" label={t('Tiêu đề')} required>
            <Input />
          </Form.Item>

          <Form.Item name="type" label={t('Loại')}>
            <Select
              defaultValue={1}
              style={{ width: 120 }}
              options={[
                { value: 1, label: t('Cơ bản') },
                { value: 2, label: t('Nâng cao') },
              ]}
            />
          </Form.Item>

          <Form.Item name="content" label={t('Nội dung')} required>
            <ReactQuill theme="snow" modules={modules} formats={formats} />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default GrammarFormDrawer;
