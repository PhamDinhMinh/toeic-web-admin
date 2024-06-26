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
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';
import UploadFile from '@/modules/files/components/upload-file';
import UploadImages from '@/modules/files/components/upload-list-image';
import fileService from '@/modules/files/services/files.service';

import questionToeicService from '../services/question-toeic.service';
import useType from './use-select-type';

export type OptionType = {
  label: string;
  value: number;
};

type TQuestionFormDrawer = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow?: any;
  refetch?: () => Promise<any>;
};

const QuestionSingleFormDrawer: React.FC<TQuestionFormDrawer> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TQuestionFormDrawer) => {
  const uid = useId();
  const { t } = useTranslation();
  const { selectType } = useType();
  const setLoading = useAppStore((state) => state.setLoading);

  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();
  const { message } = App.useApp();
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
      return questionToeicService.createSingleQuestion(dataCreate);
    },
    onSuccess: async () => {
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
      setLoading(false);
      queryClient.refetchQueries({ queryKey: ['/question-single-list'] });
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      questionToeicService.updateQuestionSingle({ ...data, id: dataRow.id }),
    onSuccess: async () => {
      setLoading(false);
      refetch && (await refetch());
      message.success(t('Chỉnh sửa thành công'));
      setOpen(false);
      form.resetFields();
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
          ? t('Tạo mới') + ' ' + t('Câu hỏi').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('Câu hỏi').toLowerCase()
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
            disabled={createMutation.isPending || updateMutation.isPending}
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
          action === 'create'
            ? createMutation.mutate(values)
            : updateMutation.mutate(values);
        }}
      >
        <Form.Item
          name="idExam"
          label={t('Thuộc đề')}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          initialValue={2}
          hidden={true}
        >
          <Select options={[{ value: 2, label: t('Part') + ' 1' }]} />
        </Form.Item>

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
              { value: EExamTipsType.Part1, label: t('Part') + ' 1' },
              { value: EExamTipsType.Part2, label: t('Part') + ' 2' },
              { value: EExamTipsType.Part5, label: t('Part') + ' 5' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="numberSTT"
          label={t('STT câu')}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          style={{ display: 'inline-block', width: '45%' }}
        >
          <Select allowClear showSearch>
            {[...Array.from({ length: 200 }, (_, i) => i + 1)].map((number) => (
              <Select.Option key={number} value={number}>
                {number}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label={t('Dạng bài')}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Select
            options={(selectType(partId) ?? []) as OptionType[]}
            mode="multiple"
          />
        </Form.Item>

        <Form.Item name="content" label={t('Nội dung')}>
          <Input />
        </Form.Item>

        <Form.Item label={t('Đáp án')}>
          <Form.List
            name="answers"
            rules={[
              {
                validator: async (_, answers) => {
                  if (!answers || answers.length <= 2) {
                    return Promise.reject(
                      new Error(t('Nên có từ 3 hoặc 4 đáp án')),
                    );
                  } else if (answers.every((e: any) => !e?.isBoolean)) {
                    return Promise.reject(new Error(t('Phải có đáp án đúng')));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Flex
                    key={uid + 'FIELD' + key}
                    vertical
                    style={{ width: '100%' }}
                  >
                    <Form.Item
                      {...restField}
                      style={{
                        marginBottom: 0,
                      }}
                      name={[name, 'content']}
                      labelCol={{ span: 0 }}
                    >
                      <Input placeholder={t('Đáp án') + ' ' + (index + 1)} />
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
                              ['answers', f.name, 'isBoolean'],
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
                      <Button onClick={() => remove(name)} danger>
                        {t('Xoá')}
                      </Button>
                    </Flex>
                  </Flex>
                ))}

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

        <Form.Item name="transcription" label={t('Giải thích')}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="audioUrl" label={t('File nghe')}>
          <UploadFile multiple={false} accept=".mp3, .mp4" />
        </Form.Item>

        <Form.Item name="imageUrl" label={t('Hình ảnh')}>
          <UploadImages />
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

export default QuestionSingleFormDrawer;
