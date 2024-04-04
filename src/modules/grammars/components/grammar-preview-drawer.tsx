import { Button, Descriptions, Drawer, Empty } from 'antd';

import useTranslation from '@/hooks/useTranslation';

import { IGrammarResponse } from '../grammars.model';
import EGrammarTypeTag from './grammar-type-tag';

type TGrammarPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dataRow?: IGrammarResponse;
};

const GrammarPreviewDrawer: React.FC<TGrammarPreviewProps> = ({
  open,
  setOpen,
  dataRow,
}: TGrammarPreviewProps) => {
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
              children: <EGrammarTypeTag type={dataRow.type} />,
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
                    __html: dataRow.content,
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

export default GrammarPreviewDrawer;
