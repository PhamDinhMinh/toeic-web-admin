import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Image,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useId, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';

import useTranslation from '@/hooks/useTranslation';
import {
  IQuestionGroupResponse,
  IQuestionSingleResponse,
} from '@/modules/questions-toeic/services/question-toeic.model';

import examService from '../services/exams.service';

type TExamPreviewDrawer = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
};

const ExamPreviewDrawer: React.FC<TExamPreviewDrawer> = ({
  open,
  setOpen,
  id,
}: TExamPreviewDrawer) => {
  const { t } = useTranslation();
  const uid = useId();

  const { data: getDetailExam } = useQuery({
    queryKey: ['/exams-detail', id],
    queryFn: () =>
      examService.getById({
        id: id,
      }),
    enabled: id === 0 || !!id,
  });

  const dataDetail = useMemo(
    () => getDetailExam?.data?.data,
    [getDetailExam?.data?.data],
  );

  const numberFrom = useCallback((index: number) => {
    if (index < 4) {
      return 147 + index * 2;
    } else if (index < 7) {
      return 155 + (index - 4) * 3;
    } else if (index < 10) {
      return 164 + (index - 7) * 4;
    } else return 176 + (index - 10) * 5;
  }, []);

  const numberTo = useCallback((index: number) => {
    if (index < 4) {
      return 146 + (index + 1) * 2;
    } else if (index < 7) {
      return 155 + (index - 3) * 3;
    } else if (index < 10) {
      return 163 + (index - 6) * 4;
    } else return 175 + (index - 9) * 5;
  }, []);

  return (
    <Drawer
      title={t('Chi tiết')}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Huỷ')}</Button>}
    >
      {!getDetailExam ? (
        <Empty />
      ) : (
        <Descriptions
          column={1}
          title=""
          items={[
            {
              label: t('Tên đề thi'),
              span: 2,
              children: dataDetail?.nameExam,
            },
            {
              label: t('Người tạo'),
              span: 2,
              children: dataDetail?.creatorName,
            },
            {
              label: t('Thời gian tạo'),
              span: 2,
              children: dayjs(dataDetail?.creationTime).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
            {
              label: t('Part') + ' ' + 1,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part1?.map(
                    (question: IQuestionSingleResponse, index: number) => (
                      <div
                        key={index + 'question-part1' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionSingle
                          question={question}
                          index={index}
                          countPrevious={0}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 2,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part2?.map(
                    (question: IQuestionSingleResponse, index: number) => (
                      <div
                        key={index + 'question-part2' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionSingle
                          question={question}
                          index={index}
                          countPrevious={6}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 3,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part3?.map(
                    (groupQuestion: IQuestionGroupResponse, index: number) => (
                      <div
                        key={index + 'question-part3' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionGroup
                          groupQuestion={groupQuestion}
                          index={index}
                          numberSTTFrom={31 + index * 3 + 1}
                          numberSTTTo={31 + (index + 1) * 3}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 4,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part4?.map(
                    (groupQuestion: IQuestionGroupResponse, index: number) => (
                      <div
                        key={index + 'question-part4' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionGroup
                          groupQuestion={groupQuestion}
                          index={index}
                          numberSTTFrom={70 + index * 3 + 1}
                          numberSTTTo={70 + (index + 1) * 3}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 5,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part5?.map(
                    (question: IQuestionSingleResponse, index: number) => (
                      <div
                        key={index + 'question-part5' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionSingle
                          question={question}
                          index={index}
                          countPrevious={100}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 6,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part6?.map(
                    (groupQuestion: IQuestionGroupResponse, index: number) => (
                      <div
                        key={index + 'question-part6' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionGroup
                          groupQuestion={groupQuestion}
                          index={index}
                          numberSTTFrom={130 + index * 4 + 1}
                          numberSTTTo={130 + (index + 1) * 4}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
            {
              label: t('Part') + ' ' + 7,
              span: 1,
              children: (
                <Flex vertical>
                  {dataDetail?.part7?.map(
                    (groupQuestion: IQuestionGroupResponse, index: number) => (
                      <div
                        key={index + 'question-part7' + uid}
                        style={{ marginBottom: 10 }}
                      >
                        <ItemQuestionGroup
                          groupQuestion={groupQuestion}
                          index={index}
                          numberSTTFrom={numberFrom(index)}
                          numberSTTTo={numberTo(index)}
                        />
                      </div>
                    ),
                  )}
                </Flex>
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default ExamPreviewDrawer;

const ItemQuestionSingle = ({
  question,
  index,
  countPrevious,
}: {
  question: IQuestionSingleResponse;
  index: number;
  countPrevious: number;
}) => {
  const uid = useId();

  return (
    <>
      <Typography.Text>
        <Typography.Text style={{ fontWeight: '600' }}>
          Câu {index + 1 + countPrevious}:
        </Typography.Text>
        {question?.content}
      </Typography.Text>
      <Flex justify="center" style={{ backgroundColor: 'red', width: '100%' }}>
        {question?.imageUrl &&
          question?.imageUrl.map((image: string) => (
            <>
              <Image width={250} src={image} height={100} />
            </>
          ))}{' '}
        {question?.audioUrl && (
          <AudioPlayer
            src={question?.audioUrl ?? ''}
            showSkipControls={false}
            showJumpControls={false}
            preload="none"
          />
        )}
      </Flex>
      <Flex vertical>
        {question?.answers?.map((answer: any, index: number) => (
          <div
            key={index + uid + 'answers'}
            style={{
              color: answer.isBoolean ? 'rgb(36, 208, 163)' : 'inherit',
            }}
          >
            {String.fromCharCode(65 + index)}: {answer.content}
          </div>
        ))}
      </Flex>
    </>
  );
};

const ItemQuestionGroup = ({
  groupQuestion,
  index,
  numberSTTFrom,
  numberSTTTo,
}: {
  groupQuestion: IQuestionGroupResponse;
  index: number;
  numberSTTFrom: number;
  numberSTTTo: number;
}) => {
  const uid = useId();

  return (
    <>
      <Typography.Text>
        <Typography.Text style={{ fontWeight: '600' }}>
          Câu {numberSTTFrom + '-' + numberSTTTo}:
        </Typography.Text>
        {groupQuestion?.content && (
          <div
            dangerouslySetInnerHTML={{ __html: groupQuestion?.content }}
            style={{ maxHeight: 250, overflow: 'scroll' }}
          />
        )}
      </Typography.Text>
      <Flex justify="center" style={{ backgroundColor: 'red', width: '100%' }}>
        {groupQuestion?.imageUrl &&
          groupQuestion?.imageUrl.map((image: string) => (
            <>
              <Image width={250} src={image} height={100} />
            </>
          ))}{' '}
        {groupQuestion?.audioUrl && (
          <AudioPlayer
            src={groupQuestion?.audioUrl ?? ''}
            showSkipControls={false}
            showJumpControls={false}
            preload="none"
          />
        )}
      </Flex>
      <Flex vertical>
        {groupQuestion?.questions?.map((question: any, indexQ: number) => (
          <>
            <Typography>
              Câu {numberSTTFrom + indexQ}: {question?.content}
            </Typography>
            {question?.answers?.map((answer: any, indexA: number) => (
              <div
                key={indexA + uid + 'answers'}
                style={{
                  color: answer.isBoolean ? 'rgb(36, 208, 163)' : 'inherit',
                }}
              >
                {String.fromCharCode(65 + index)}: {answer.content}
              </div>
            ))}
          </>
        ))}
      </Flex>
    </>
  );
};
