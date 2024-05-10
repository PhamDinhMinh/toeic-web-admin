import { PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  App,
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useId, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import {
  TypePart1,
  TypePart2,
  TypePart3,
  TypePart4,
  TypePart5,
  TypePart6,
  TypePart7,
} from '../services/question-toeic.model';
import questionToeicService from '../services/question-toeic.service';

type OptionType = {
  label: string;
  value: number;
};

type TQuestionGroupFormDrawer = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow?: any;
  refetch?: () => Promise<any>;
};

const QuestionGroupFormDrawer: React.FC<TQuestionGroupFormDrawer> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TQuestionGroupFormDrawer) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const setLoading = useAppStore((state) => state.setLoading);

  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();
  const uid = useId();

  const partId = Form.useWatch('partId', form);
  useEffect(() => {}, [action, dataRow, form]);

  const selectType = () => {
    switch (partId) {
      case EExamTipsType.Part1:
        return TypePart1;
      case EExamTipsType.Part2:
        return TypePart2;
      case EExamTipsType.Part3:
        return TypePart3;
      case EExamTipsType.Part4:
        return TypePart4;
      case EExamTipsType.Part5:
        return TypePart5;
      case EExamTipsType.Part6:
        return TypePart6;
      case EExamTipsType.Part7:
        return TypePart7;
      default:
        return TypePart1;
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => questionToeicService.createGroupQuestion(data),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
      setLoading(false);
      // queryClient.refetchQueries({ queryKey: ['/question-single-list'] });
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('Nhóm câu hỏi').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('Nhóm câu hỏi').toLowerCase()
      }
      open={open}
      onClose={() => setOpen(false)}
      width={840}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Đóng')}</Button>

          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
              hiddenSubmitRef.current.click();
            }}
          >
            {t('Xác nhận')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="question-single-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => {
          setLoading(true);
          action === 'create' ? createMutation.mutate(values) : '';
        }}
      >
        {/* <Form.Item
          name="idExam"
          label={t('Thuộc đề')}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          name="partId"
          label={t('Phần thi')}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{
            display: 'inline-block',
            width: '50%',
            marginRight: '5%',
          }}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Select
            options={[
              { value: EExamTipsType.Part3, label: t('Part') + ' 3' },
              { value: EExamTipsType.Part4, label: t('Part') + ' 4' },
              { value: EExamTipsType.Part6, label: t('Part') + ' 6' },
              { value: EExamTipsType.Part7, label: t('Part') + ' 7' },
            ]}
          />
        </Form.Item>

        <Form.Item name="audioUrl" label={t('File nghe')}>
          <Input />
        </Form.Item>

        <Form.Item name="imageUrl" label={t('Hình ảnh')}>
          <Input />
        </Form.Item>

        <Form.Item label={t('Câu hỏi')}>
          <Form.List
            name="questions"
            rules={[
              {
                validator: async (_, questions) => {
                  if (
                    !questions ||
                    questions.length < 2 ||
                    questions.length > 5
                  ) {
                    return Promise.reject(
                      new Error(t('Câu hỏi nhóm chỉ nên từ 2-5 câu')),
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Flex
                    key={key + uid}
                    vertical
                    style={{
                      width: '100%',
                      border: '1px solid #E0E0E0',
                      marginBottom: '10px',
                      borderRadius: 8,
                    }}
                  >
                    <Flex style={{ padding: '8px' }} vertical>
                      <Form.Item
                        name={[name, 'numberSTT']}
                        label={t('STT câu')}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 8 }}
                      >
                        <Select allowClear showSearch>
                          {[
                            ...Array.from({ length: 200 }, (_, i) => i + 1),
                          ].map((number) => (
                            <Select.Option key={number} value={number}>
                              {number}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name={[name, 'type']}
                        label={t('Dạng bài')}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 21 }}
                        rules={[
                          {
                            required: true,
                            message: t('Trường này không được bỏ trống!'),
                          },
                        ]}
                      >
                        <Select
                          options={(selectType() ?? []) as OptionType[]}
                          mode="multiple"
                        />
                      </Form.Item>

                      <Form.Item
                        name={[name, 'content']}
                        label={t('Nội dung')}
                        labelCol={{ span: 3 }}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item label={t('Đáp án')} labelCol={{ span: 3 }}>
                        <Form.List
                          name={[name, 'answers']}
                          rules={[
                            {
                              validator: async (_, answers) => {
                                if (!answers || answers.length <= 2) {
                                  return Promise.reject(
                                    new Error(t('Nên có từ 3 hoặc 4 đáp án')),
                                  );
                                } else if (
                                  answers.every((e: any) => !e?.isBoolean)
                                ) {
                                  return Promise.reject(
                                    new Error(t('Phải có đáp án đúng')),
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          {(fields, { add, remove }, { errors }) => (
                            <>
                              {fields.map(
                                ({ key, name, ...restField }, index) => (
                                  <Flex
                                    key={key}
                                    vertical
                                    style={{ width: '100%' }}
                                  >
                                    <Form.Item
                                      {...restField}
                                      key={index}
                                      name={[name, 'content']}
                                      style={{ margin: 0 }}
                                    >
                                      <Input
                                        placeholder={
                                          t('Đáp án') + ' ' + (index + 1)
                                        }
                                      />
                                    </Form.Item>
                                    <Flex
                                      justify="space-between"
                                      align="center"
                                      style={{
                                        marginTop: 0,
                                        marginBottom: 0,
                                        height: '40px',
                                      }}
                                    >
                                      <Form.Item
                                        style={{ marginBottom: 0 }}
                                        name={[name, 'isBoolean']}
                                        valuePropName="checked"
                                        initialValue={false}
                                        getValueFromEvent={(e) => {
                                          fields.forEach((f) => {
                                            form.setFieldValue(
                                              [
                                                'questions',
                                                'answers',
                                                f.name,
                                                'isBoolean',
                                              ],
                                              false,
                                            );
                                          });
                                          return e.target.checked;
                                        }}
                                        {...restField}
                                      >
                                        <Radio>
                                          {t('Đáp án đúng')} {index}
                                        </Radio>
                                      </Form.Item>
                                      <Button
                                        onClick={() => remove(name)}
                                        danger
                                      >
                                        {t('Xoá')}
                                      </Button>
                                    </Flex>
                                  </Flex>
                                ),
                              )}

                              {fields.length < 4 && (
                                <Button
                                  onClick={() => add()}
                                  disabled={fields.length >= 4}
                                  icon={<PlusOutlined />}
                                  type="primary"
                                >
                                  {t('Thêm câu trả lời')}
                                </Button>
                              )}
                              <Form.ErrorList errors={errors} />
                            </>
                          )}
                        </Form.List>
                      </Form.Item>

                      <Form.Item
                        name={[name, 'transcription']}
                        label={t('Giải thích')}
                        labelCol={{ span: 3 }}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    </Flex>
                    <Button
                      onClick={() => remove(name)}
                      danger
                      style={{
                        justifyContent: 'flex-end',
                        margin: '0 8px 8px',
                      }}
                    >
                      {t('Xoá')}
                    </Button>
                  </Flex>
                ))}

                {fields.length < 4 && (
                  <Button
                    onClick={() => add()}
                    disabled={fields.length >= 4}
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    {t('Thêm câu hỏi')}
                  </Button>
                )}
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <button
              type="submit"
              style={{ display: 'none' }}
              ref={hiddenSubmitRef}
            />
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default QuestionGroupFormDrawer;
