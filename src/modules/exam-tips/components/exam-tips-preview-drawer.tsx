import { Button, Descriptions, Drawer, Empty } from 'antd';

import useTranslation from '@/hooks/useTranslation';

import { IExamTipsResponse } from '../exam-tips.model';
import EExamTipTypeTag from './part-type-tag';

type TExamTipsPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dataRow?: IExamTipsResponse;
};

const ExamTipsPreviewDrawer: React.FC<TExamTipsPreviewProps> = ({
  open,
  setOpen,
  dataRow,
}: TExamTipsPreviewProps) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={t('Chi tiết')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Huỷ')}</Button>}
    >
      {!dataRow ? (
        <Empty />
      ) : (
        <Descriptions
          column={1}
          title=""
          items={[
            {
              label: t('Tiêu đề'),
              span: 1,
              children: dataRow.title,
            },
            {
              label: t('Loại'),
              span: 2,
              children: <EExamTipTypeTag type={dataRow.type} />,
            },
            {
              label: t('Người tạo'),
              span: 2,
              children: <></>,
            },
            {
              label: t('Nội dung'),
              span: 1,
              children: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataRow.description,
                  }}
                />
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default ExamTipsPreviewDrawer;
