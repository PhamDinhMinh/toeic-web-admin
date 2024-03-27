import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout, theme } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/configs/constants';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import MainSideNav from '@/shared/components/layouts/app/side-nav';
import MainTopBar from '@/shared/components/layouts/app/top-bar';
import { TST } from '@/shared/types/tst.type';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();

  const { token } = theme.useToken();
  const tokenAuth = Cookies.get(ACCESS_TOKEN_KEY);

  const userInformation = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!tokenAuth && !userInformation) {
      logout();
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
      navigate({ to: '/auth/login' });
    }
  }, [logout, navigate, tokenAuth, userInformation]);

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />

        <SContent token={token} className="main-content">
          <Outlet />
        </SContent>
      </Layout>
    </Layout>
  );
}

// export default MainTemplate;

const SContent = styled(Layout.Content)<TST>`
  margin: ${({ token }) => token.margin}px;
  padding: ${({ token }) => token.padding}px;
  background-color: ${({ token }) => token.colorBgContainer};
  border-radius: ${({ token }) => token.borderRadius}px;
  height: calc(100vh - 64px - 2 * ${({ token }) => token.margin}px);
  overflow-y: scroll;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
`;
