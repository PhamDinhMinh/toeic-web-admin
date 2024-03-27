import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout } from 'antd';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

import { ACCESS_TOKEN_KEY } from '@/configs/constants';
import { useAuthStore } from '@/modules/auth/auth.zustand';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  console.log(token, 'token null');
  const userInformation = useAuthStore((state: any) => state.user);

  useEffect(() => {
    if (userInformation) {
      navigate({
        to: '/',
      });
    }
  }, [navigate, token, userInformation]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
