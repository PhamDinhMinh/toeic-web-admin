import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Skeleton,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import useTranslation from '@/hooks/useTranslation';

import { EUserGender } from '../services/user.model';
import userService from '../services/user.service';

type TUserFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const UserFormDrawer: React.FC<TUserFormDrawerProps> = ({
  open,
  setOpen,
  action,
  id = 0,
  refetch,
}: TUserFormDrawerProps) => {
  const { t } = useTranslation();

  const { message } = App.useApp();
  const [form] = Form.useForm();

  const { data: getUserById, isLoading } = useQuery({
    queryKey: ['/get-user-by-id', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  useEffect(() => {
    if (getUserById?.data) {
      const user = getUserById?.data?.data;
      form.setFieldsValue({
        ...user,
        dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      });
    }
  }, [getUserById?.data, form]);

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => userService.updateUser(id, data),
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
      forceRender
      title={action === 'create' ? t('Tạo mới') : t('Chỉnh sửa')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Huỷ')}</Button>

          <Button
            type="primary"
            loading={updateUserMutation.isPending}
            disabled={isLoading}
            onClick={() => {
              form.submit();
            }}
          >
            {t('Xác nhận')}
          </Button>
        </Space>
      }
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="users"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            action === 'create'
              ? ''
              : updateUserMutation.mutate({
                  ...values,
                  id,
                  dateOfBirth: dayjs(values.dateOfBirth).toISOString(),
                });
          }}
        >
          <Form.Item name="name" label={t('Họ và tên')} required>
            <Input />
          </Form.Item>

          <Form.Item name="gender" label={t('Giới tính')}>
            <Radio.Group>
              <Radio value={EUserGender.MALE}>{t('Nam')}</Radio>
              <Radio value={EUserGender.FEMALE}>{t('Nữ')}</Radio>
              <Radio value={EUserGender.OTHER}>{t('Khác')}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="phoneNumber" label={t('Số điện thoại')}>
            <Input />
          </Form.Item>

          <Form.Item name="dateOfBirth" label={t('Ngày sinh')}>
            <DatePicker />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UserFormDrawer;
