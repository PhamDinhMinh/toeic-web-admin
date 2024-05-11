import { Button, Descriptions, Drawer, Empty, Image } from 'antd';
import { useId } from 'react';

import useTranslation from '@/hooks/useTranslation';
import PartTypeTag from '@/modules/exam-tips/components/part-type-tag';

import { IQuestionGroupResponse } from '../services/question-toeic.model';
import TypePartTypeTag from './type-part-type-tag';

type TQuestionGroupPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  dataRow?: IQuestionGroupResponse;
};

const QuestionGroupPreviewDrawer: React.FC<TQuestionGroupPreviewProps> = ({
  open,
  setOpen,
  dataRow,
}: TQuestionGroupPreviewProps) => {
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
              label: t('Ảnh'),
              children: (
                <>
                  {dataRow.imageUrl &&
                    dataRow.imageUrl.map((image: string) => (
                      <>
                        <Image width={250} src={image} />
                      </>
                    ))}
                </>
              ),
            },
            {
              label: t('File nghe'),
              children: dataRow.audioUrl,
            },
            {
              label: t('Phần thi'),
              children: <PartTypeTag type={dataRow.partId} />,
            },
            {
              label: t('Câu hỏi'),
              children: (
                <div>
                  {dataRow.questions.map((question: any, index: number) => (
                    <>
                      <Descriptions
                        column={1}
                        title={`Câu hỏi số ${index}`}
                        labelStyle={{ minWidth: 80 }}
                        items={[
                          {
                            label: t('Dạng câu'),
                            contentStyle: {
                              width: '100%',
                              flexWrap: 'wrap',
                            },
                            children: (
                              <TypePartTypeTag
                                partId={dataRow?.partId}
                                type={question.type}
                              />
                            ),
                          },
                          {
                            label: t('Đáp án'),
                            children: (
                              <div>
                                {question.answers.map(
                                  (answer: any, index: number) => (
                                    <div
                                      key={index + uid + 'answers'}
                                      style={{
                                        color: answer.isBoolean
                                          ? '#00FF00'
                                          : 'inherit',
                                      }}
                                    >
                                      {String.fromCharCode(65 + index)}:{' '}
                                      {answer.content}
                                    </div>
                                  ),
                                )}
                              </div>
                            ),
                          },
                          {
                            label: t('Giải thích'),
                            children: question.transcription,
                          },
                        ]}
                      />
                    </>
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default QuestionGroupPreviewDrawer;
