import { createFileRoute } from '@tanstack/react-router';
import { Divider, Flex, Tabs, TabsProps } from 'antd';

import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/user-setting/')({
  component: QuestionListPage,
});

function QuestionListPage() {
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));

  return (
    <Flex vertical>
      <TitleHeading>{t('Quản lý người dùng')}</TitleHeading>

      <Divider />
    </Flex>
  );
}

export default QuestionListPage;
