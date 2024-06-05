import { Button, Form, Select, Space } from 'antd';

import useTranslation from '@/hooks/useTranslation';

import { EGrammarType } from '../grammars.model';

type TGrammarFilterFormProps = {
  onSubmit: (values: any) => void;
};

const GrammarFilterForm = ({ onSubmit }: TGrammarFilterFormProps) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="Grammar-filter-form"
      autoComplete="off"
      style={{ width: 360 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={(values) => onSubmit(values)}
      initialValues={{
        roles: [],
      }}
    >
      <Form.Item name="type" label={t('Loại')}>
        <Select
          style={{ width: '100%' }}
          allowClear
          options={[
            { value: EGrammarType.BASIC, label: t('Cơ bản') },
            { value: EGrammarType.ADVANCED, label: t('Nâng cao') },
          ]}
          onChange={(e) => {
            form.setFieldValue('type', e);
          }}
        />
      </Form.Item>

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

export default GrammarFilterForm;
