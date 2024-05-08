import { createFileRoute } from '@tanstack/react-router';
import { Button, Tabs, TabsProps } from 'antd';
import { useId, useState } from 'react';

import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import QuestionGroup from '@/modules/questions-toeic/components/question-group';
import QuestionSingle from '@/modules/questions-toeic/components/question-single';
import QuestionFormDrawer from '@/modules/questions-toeic/components/question-single-form-drawer';

export const Route = createFileRoute('/_app/question-toeic/')({
  component: QuestionListPage,
});

function QuestionListPage() {
  const { t } = useTranslation();

  useAppTitle(t('Xác nhận'));

  const [openSingleFormDrawer, setOpenSingleFormDrawer] =
    useState<boolean>(false);
  const uid = useId();

  const [selectedTab, setSelectedTab] = useState(uid + 0);

  const itemsTab: TabsProps['items'] = [
    {
      key: '1',
      label: t('Câu đơn'),
      children: <QuestionSingle />,
    },
    {
      key: '2',
      label: 'Câu nhóm',
      children: <QuestionGroup />,
    },
  ];

  return (
    <>
      {openSingleFormDrawer && (
        <QuestionFormDrawer
          open={openSingleFormDrawer}
          setOpen={setOpenSingleFormDrawer}
          action="create"
        />
      )}

      <Tabs
        activeKey={selectedTab}
        onTabClick={(key) => setSelectedTab(key)}
        tabBarExtraContent={
          <Button
            type="primary"
            onClick={() => {
              selectedTab === uid + 0 ? setOpenSingleFormDrawer(true) : '';
            }}
          >
            {t('Tạo mới')}
          </Button>
        }
        items={itemsTab.map((item, i) => {
          const id = uid + i;
          return {
            key: id,
            label: item?.label,
            children: item.children,
          };
        })}
      />
    </>
  );
}

export default QuestionListPage;
