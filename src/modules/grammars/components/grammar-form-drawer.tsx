import { useMutation } from '@tanstack/react-query';
import { App, Button, Drawer, Form, Input, Select, Space } from 'antd';
import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import {
  formatsQuill,
  modulesQuill,
} from '@/shared/components/quill/quill.model';

import { EGrammarType, IGrammarResponse } from '../grammars.model';
import grammarService from '../grammars.service';

type TGrammarFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  dataRow: IGrammarResponse;
  refetch?: () => Promise<any>;
};

const GrammarFormDrawer: React.FC<TGrammarFormDrawerProps> = ({
  open,
  setOpen,
  action,
  dataRow,
  refetch,
}: TGrammarFormDrawerProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const setLoading = useAppStore((state) => state.setLoading);

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const createMutation = useMutation({
    mutationFn: (data: any) => grammarService.create(data),
    onSuccess: async () => {
      setLoading(false);
      refetch && (await refetch());
      message.success(t('Tạo mới thành công'));
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      dataRow ? grammarService.update(data) : (null as any),
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

  useEffect(() => {
    if (action === 'create') {
      form.resetFields();
    } else {
      dataRow &&
        form.setFieldsValue({
          title: dataRow.title,
          type: dataRow.type,
          content: dataRow.content,
        });
    }
  }, [action, dataRow, form]);

  return (
    <Drawer
      title={
        action === 'create'
          ? t('Tạo mới') + ' ' + t('chủ đề').toLowerCase()
          : t('Chỉnh sửa') + ' ' + t('chủ đề').toLowerCase()
      }
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{t('Đóng')}</Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending || updateMutation.isPending}
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
        name="grammar-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => {
          setLoading(true);
          action === 'create'
            ? createMutation.mutate({
                ...values,
                creatorId: user?.id,
              })
            : updateMutation.mutate({
                ...values,
                creatorId: dataRow?.creatorId,
                id: dataRow.id,
              });
        }}
      >
        <Form.Item
          name="title"
          label={t('Tiêu đề')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="type" label={t('Loại')}>
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            options={[
              { value: EGrammarType.BASIC, label: t('Cơ bản') },
              { value: EGrammarType.ADVANCED, label: t('Nâng cao') },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={t('Nội dung')}
          rules={[
            { required: true, message: t('Trường này không được bỏ trống!') },
          ]}
        >
          <ReactQuill
            theme="snow"
            modules={modulesQuill}
            formats={formatsQuill}
          />
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

export default GrammarFormDrawer;
