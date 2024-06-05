import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';
import UploadFile from '@/modules/files/components/upload-file';
import UploadImages from '@/modules/files/components/upload-list-image';
import fileService from '@/modules/files/services/files.service';
import {
  formatsQuill,
  modulesQuill,
} from '@/shared/components/quill/quill.model';

import questionToeicService from '../services/question-toeic.service';
import useType from './use-select-type';

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
  const { selectType } = useType();
  const queryClient = useQueryClient();

  const partId = Form.useWatch('partId', form);

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    } else {
      dataRow && form.setFieldsValue(dataRow);
    }
  }, [action, dataRow, form]);

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      let dataCreate = values;
      if (values?.audioUrl) {
        const response = await fileService.uploadFile([values.audioUrl]);
        form.setFieldValue('audioUrl', response.data[0]);
        dataCreate = { ...dataCreate, audioUrl: response.data[0] };
      }
      if (values?.imageUrl) {
        const mappedImages = values.imageUrl.map((i: any) => i.originFileObj);
        const response = await fileService.uploadImages(mappedImages);
        form.setFieldValue('imageUrl', response.data);
        dataCreate = { ...dataCreate, imageUrl: response.data };
      }
      return questionToeicService.createGroupQuestion(dataCreate);
    },
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
      setLoading(false);
      queryClient.refetchQueries({ queryKey: ['/question-group-list'] });
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
            disabled={createMutation.isPending}
          >
            {t('Xác nhận')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="question-group-form"
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
          <UploadFile multiple={false} accept=".mp3, .mp4" />
        </Form.Item>

        <Form.Item name="imageUrl" label={t('Hình ảnh')}>
          <UploadImages />
        </Form.Item>

        <Form.Item name="content" label={t('Nội dung')}>
          <ReactQuill
            theme="snow"
            modules={modulesQuill}
            formats={formatsQuill}
          />
        </Form.Item>

        <Form.Item name="transcription" label={t('Giải thích')}>
          <TextArea rows={4} />
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
                {fields.map(({ key, name, ...restField }, indexQ) => (
                  <Flex
                    key={key + uid + indexQ}
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
                        {...restField}
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
                        {...restField}
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
                          options={(selectType(partId) ?? []) as OptionType[]}
                          mode="multiple"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        label={t('Nội dung')}
                        labelCol={{ span: 3 }}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label={t('Đáp án')}
                        labelCol={{ span: 3 }}
                        {...restField}
                      >
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
                                    key={uid + 'Answers' + key}
                                    vertical
                                    style={{ width: '100%' }}
                                  >
                                    <Form.Item
                                      {...restField}
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
                                            console.log(f);
                                            form.setFieldValue(
                                              [
                                                'questions',
                                                indexQ,
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
