import { Button, Form, Select, Space } from 'antd';

import useTranslation from '@/hooks/useTranslation';
import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import { OptionType } from './question-single-form-drawer';
import useType from './use-select-type';

type TQuestionFilterFormProps = {
  onSubmit: (values: any) => void;
  single?: boolean;
};

const QuestionFilterForm = ({ onSubmit, single }: TQuestionFilterFormProps) => {
  const { t } = useTranslation();
  const { selectType } = useType();

  const [form] = Form.useForm();

  const partId = Form.useWatch('partId', form);

  return (
    <Form
      form={form}
      name="question-filter-form"
      autoComplete="off"
      style={{ width: 360 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={(values) => onSubmit(values)}
      initialValues={{
        roles: [],
      }}
    >
      <Form.Item name="partId" label={t('Phần thi')}>
        <Select
          style={{ width: '100%' }}
          allowClear
          options={
            single
              ? [
                  { value: EExamTipsType.Part1, label: t('Part') + ' 1' },
                  { value: EExamTipsType.Part2, label: t('Part') + ' 2' },
                  { value: EExamTipsType.Part5, label: t('Part') + ' 5' },
                ]
              : [
                  { value: EExamTipsType.Part3, label: t('Part') + ' 3' },
                  { value: EExamTipsType.Part4, label: t('Part') + ' 4' },
                  { value: EExamTipsType.Part6, label: t('Part') + ' 6' },
                  { value: EExamTipsType.Part7, label: t('Part') + ' 7' },
                ]
          }
          onChange={(e) => {
            form.setFieldValue('partId', e);
          }}
        />
      </Form.Item>
      {single && (
        <Form.Item name="type" label={t('Dạng bài')}>
          <Select
            options={(selectType(partId) ?? []) as OptionType[]}
            mode="multiple"
          />
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            type="dashed"
            htmlType="button"
            size="middle"
            onClick={() => {
              form.resetFields();
              onSubmit({});
            }}
          >
            {t('Bỏ lọc')}
          </Button>
          <Button type="primary" htmlType="submit" size="middle">
            {t('Lưu')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default QuestionFilterForm;
