import { Button, Descriptions, Drawer, Empty, Image } from 'antd';
import { useId } from 'react';
import AudioPlayer from 'react-h5-audio-player';

import useTranslation from '@/hooks/useTranslation';
import PartTypeTag from '@/modules/exam-tips/components/part-type-tag';

import { IQuestionSingleResponse } from '../services/question-toeic.model';
import TypePartTypeTag from './type-part-type-tag';

type TQuestionSinglePreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dataRow?: IQuestionSingleResponse;
};

const QuestionSinglePreviewDrawer: React.FC<TQuestionSinglePreviewProps> = ({
  open,
  setOpen,
  dataRow,
}: TQuestionSinglePreviewProps) => {
  const { t } = useTranslation();
  const uid = useId();

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
          labelStyle={{ minWidth: 80 }}
          items={[
            {
              label: t('Nội dung'),
              children: dataRow.content ?? 'Không có',
            },
            {
              label: t('Phần thi'),
              children: <PartTypeTag type={dataRow.partId} />,
            },
            {
              label: t('Loại'),
              children: (
                <TypePartTypeTag partId={dataRow?.partId} type={dataRow.type} />
              ),
            },
            {
              label: t('Ảnh'),
              children: (
                <>
                  {dataRow?.imageUrl?.map((image, index) => (
                    <Image
                      key={index + 'Image' + uid}
                      wrapperStyle={{ flexShrink: 0, border: '1px solid #eee' }}
                      preview={{ src: image }}
                      src={image}
                      style={{ objectFit: 'contain', maxHeight: 250 }}
                    />
                  ))}
                </>
              ),
            },
            {
              label: t('File nghe'),
              children: (
                <>
                  {dataRow?.audioUrl && (
                    <AudioPlayer
                      style={{ borderRadius: '1rem' }}
                      src={dataRow?.audioUrl}
                      showSkipControls={false}
                      showJumpControls={false}
                      preload="none"
                    />
                  )}
                </>
              ),
            },
            {
              label: t('Đáp án'),
              children: (
                <div>
                  {dataRow.answers.map((answer: any, index: number) => (
                    <div
                      key={index + uid + 'answers'}
                      style={{
                        color: answer.isBoolean
                          ? 'rgb(36, 208, 163)'
                          : 'inherit',
                      }}
                    >
                      {String.fromCharCode(65 + index)}: {answer.content}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              label: t('Giải thích'),
              children: dataRow.transcription,
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default QuestionSinglePreviewDrawer;
