import { useMutation } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { App, Button, Form, Input, Layout, Typography } from 'antd';
import { AxiosError } from 'axios';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { TRegisterInput } from '@/modules/auth/auth.model';
import authService from '@/modules/auth/auth.service';
import { THttpResponse } from '@/shared/http-service';
import { transApiResDataCode } from '@/shared/utils';
import { color } from '@/style/global-styles';

export const Route = createFileRoute('/_auth/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { t } = useTranslation();

  const setLoading = useAppStore((state) => state.setLoading);

  const { notification } = App.useApp();

  const [form] = Form.useForm<TRegisterInput>();

  const registerMutation = useMutation({
    mutationFn: (input: TRegisterInput) => authService.register(input),
    onSuccess: () => {
      notification.success({
        message: t('Đăng ký thành công'),
      });
      setLoading(false);
    },
    onError: (error: AxiosError<THttpResponse<null>>) => {
      notification.error({
        message: t('Đăng ký thất bại'),
        description: transApiResDataCode(t, error.response?.data),
      });
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onFinish = async (data: TRegisterInput) => {
    registerMutation.mutate(data);
  };

  const onFinishFailed = () => {
    notification.error({
      message: t('Đăng nhập thất bại'),
      description: t('Làm ơn liên hệ với quản trị viên'),
    });
  };

  return (
    <>
      <Layout.Content
        style={{
          height: '100vh',
          backgroundImage: `url('https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 200, 0.5)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            minWidth: '35%',
          }}
        >
          <Typography.Title
            level={2}
            style={{ color: color.grey_800, textAlign: 'center' }}
          >
            {t('Đăng ký')}
          </Typography.Title>

          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ width: '100%' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item<TRegisterInput>
              name="fullName"
              rules={[
                {
                  required: true,
                  message: t('Trường này là bắt buộc'),
                },
              ]}
            >
              <Input placeholder={t('Họ tên')} />
            </Form.Item>
            <Form.Item<TRegisterInput>
              name="userName"
              rules={[
                {
                  required: true,
                  message: t('Trường này là bắt buộc'),
                },
              ]}
            >
              <Input placeholder={t('Tên đăng nhập')} />
            </Form.Item>
            <Form.Item<TRegisterInput>
              name="emailAddress"
              rules={[
                {
                  required: true,
                  message: t('Trường này là bắt buộc'),
                },
                {
                  type: 'email',
                  message: t('Email không hợp lệ'),
                },
              ]}
            >
              <Input placeholder={t('Địa chỉ email')} />
            </Form.Item>

            <Form.Item<TRegisterInput>
              name="password"
              rules={[
                {
                  required: true,
                  message: t('Trường này là bắt buộc'),
                },
              ]}
            >
              <Input.Password placeholder={t('Nhập mật khẩu')} />
            </Form.Item>
            <Form.Item<TRegisterInput>
              name="phoneNumber"
              rules={[
                {
                  pattern:
                    /(([\\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b)|^$/,
                  message: t('Số điện thoại không hợp lệ'), // Thông báo khi số điện thoại không hợp lệ
                },
              ]}
            >
              <Input placeholder={t('Số điện thoại')} />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: '100%', backgroundColor: color.green_500 }}
                type="primary"
                htmlType="submit"
              >
                {t('Đăng nhập')}
              </Button>
            </Form.Item>
            <Typography style={{ textAlign: 'end', cursor: 'pointer' }}>
              <Link to="/auth/login" style={{ color: color.grey_800 }}>
                {t('Quay lại')}
              </Link>
            </Typography>
          </Form>
        </div>
      </Layout.Content>
    </>
  );
}

export default RegisterPage;
