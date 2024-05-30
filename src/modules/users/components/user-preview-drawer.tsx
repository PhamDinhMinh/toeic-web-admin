import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Image, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import useTranslation from '@/hooks/useTranslation';

import userService from '../services/user.service';
import UserRoleTag from './user-role-tag';

type TUserPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const UserPreviewDrawer: React.FC<TUserPreviewProps> = ({
  open,
  setOpen,
  id,
}: TUserPreviewProps) => {
  const { t } = useTranslation();

  const { data: getUserById, isLoading } = useQuery({
    queryKey: ['/get-user-by-id', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  const userInfo = useMemo(
    () => getUserById?.data?.data ?? [],
    [getUserById?.data?.data],
  );

  return (
    <Drawer
      title={t('Thông tin cá nhân')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Huỷ')}</Button>}
    >
      {isLoading ? (
        <Skeleton />
      ) : !getUserById?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title={t('Thông tin cá nhân')}
          items={[
            {
              label: t('ID'),
              span: 2,
              children: userInfo?.id,
            },
            {
              label: t('Họ và tên'),
              span: 1,
              children: userInfo?.name,
            },
            {
              label: t('Giới tính'),
              span: 1,
              children: userInfo?.gender,
            },
            {
              label: t('Ngày sinh'),
              span: 1,
              children: userInfo?.dateOfBirth
                ? dayjs(userInfo?.dateOfBirth).format('YYYY/MM/DD')
                : '',
            },
            {
              label: t('Số điện thoại'),
              span: 1,
              children: userInfo?.phoneNumber,
            },
            {
              label: t('Email'),
              span: 1,
              children: userInfo?.emailAddress,
            },
            {
              label: t('Quyền'),
              span: 2,
              children: userInfo?.role && (
                <UserRoleTag key={userInfo?.role} role={userInfo?.role} />
              ),
            },
            {
              label: t('Thời gian tạo'),
              span: 2,
              children: dayjs(userInfo?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Ảnh'),
              span: 2,
              children: userInfo?.imageUrl && (
                <Image src={userInfo?.imageUrl} alt="avatar" width={200} />
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default UserPreviewDrawer;
