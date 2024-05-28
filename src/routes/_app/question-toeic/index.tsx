import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { App, Button, Tabs, TabsProps } from 'antd';
import { useCallback, useId, useState } from 'react';

import { useAppTitle } from '@/hooks/use-app-title';
import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import QuestionGroup from '@/modules/questions-toeic/components/question-group';
import QuestionGroupFormDrawer from '@/modules/questions-toeic/components/question-group-form-drawer';
import QuestionSingle from '@/modules/questions-toeic/components/question-single';
import QuestionSingleFormDrawer from '@/modules/questions-toeic/components/question-single-form-drawer';
import questionToeicService from '@/modules/questions-toeic/services/question-toeic.service';
import BaseImportExcelModal from '@/shared/components/excel/base-import-excel';

export const Route = createFileRoute('/_app/question-toeic/')({
  component: QuestionListPage,
});

function QuestionListPage() {
  const { t } = useTranslation();
  const uid = useId();
  const { message } = App.useApp();
  const setLoading = useAppStore((state) => state.setLoading);
  const queryClient = useQueryClient();

  useAppTitle(t('Xác nhận'));

  const [stateOpen, setStateOpen] = useState({
    openSingleFormDrawer: false,
    openGroupFormDrawer: false,
    openModalImport: false,
  });

  const setOpenSingleFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openSingleFormDrawer: item }));
  }, []);

  const setOpenGroupFormDrawer = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openGroupFormDrawer: item }));
  }, []);

  const setToggleModalImport = useCallback((item: boolean) => {
    setStateOpen((prev) => ({ ...prev, openModalImport: item }));
  }, []);

  const importExcelMutation = useMutation({
    mutationFn: (file: File) => questionToeicService.importExcel(file),
    onError: () => message.error(t('Đã có lỗi xảy ra')),
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: async () => {
      message.success(t('Nhập excel thành công'));
      setToggleModalImport(false);
      queryClient.refetchQueries({ queryKey: ['/question-single-list'] });
    },
  });

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
      {stateOpen.openSingleFormDrawer && (
        <QuestionSingleFormDrawer
          open={stateOpen.openSingleFormDrawer}
          setOpen={setOpenSingleFormDrawer}
          action="create"
        />
      )}

      {stateOpen.openGroupFormDrawer && (
        <QuestionGroupFormDrawer
          open={stateOpen.openGroupFormDrawer}
          setOpen={setOpenGroupFormDrawer}
          action="create"
        />
      )}

      {stateOpen.openModalImport && (
        <BaseImportExcelModal
          open={stateOpen.openModalImport}
          onClose={() => setToggleModalImport(false)}
          templateFileUrl="/assets/excel-temp/import-question-single-temp.xlsx"
          onSubmit={(file) => {
            file && importExcelMutation.mutate(file);
          }}
          isLoading={true}
        />
      )}

      <Tabs
        activeKey={selectedTab}
        onTabClick={(key) => setSelectedTab(key)}
        tabBarExtraContent={
          <>
            <Button
              type="dashed"
              onClick={() => {
                selectedTab === uid + 0 && setToggleModalImport(true);
              }}
              style={{
                marginRight: 10,
                display: selectedTab === uid + 1 ? 'none' : 'inline',
              }}
            >
              {t('Nhập excel')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                selectedTab === uid + 0
                  ? setOpenSingleFormDrawer(true)
                  : setOpenGroupFormDrawer(true);
              }}
            >
              {t('Tạo mới')}
            </Button>
          </>
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
