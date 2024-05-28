import { Button, Form, Modal, Typography } from 'antd';
import { DownloadCloudIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';

import useTranslation from '@/hooks/useTranslation';
import UploadFile from '@/modules/files/components/upload-file';

type TBaseImportExcelModalProps = {
  templateFileUrl?: string;
  onSubmit: (item: File | null) => void;
  isLoading: boolean;
  onClose: (item: boolean) => void;
  open: boolean;
};

const BaseImportExcelModal = (props: TBaseImportExcelModalProps) => {
  const { templateFileUrl, open, onClose, onSubmit } = props;

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const onClickDownloadTemplate = useCallback(() => {
    window.open(templateFileUrl, '_blank');
  }, [templateFileUrl]);

  const handleOk = useCallback(async () => {
    try {
      await form.validateFields();
      hiddenSubmitRef.current.click();
      onSubmit(form.getFieldValue('file'));
      onClose(false);
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
    }
  }, [form, onClose, onSubmit]);

  return (
    <Modal
      title={t('Nhập dữ liệu')}
      open={open}
      onCancel={() => onClose(false)}
      onOk={handleOk}
      style={{ marginTop: 0 }}
    >
      {templateFileUrl && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{t('Tải về template excel tại đây')}</Typography>
          <Button
            size="small"
            type="text"
            ghost={true}
            style={{
              color: '#1D4E89',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 20,
              padding: '12px 10px',
            }}
            onClick={onClickDownloadTemplate}
          >
            {t('Tải về')}
            <DownloadCloudIcon size={18} style={{ marginLeft: 6 }} />
          </Button>
        </div>
      )}
      <Form
        form={form}
        name="question-single-form"
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ marginTop: 10, marginBottom: 0 }}
      >
        <Form.Item
          name="file"
          rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
        >
          <UploadFile accept=".xlsx, .xls" />
        </Form.Item>
        <Form.Item shouldUpdate style={{ height: 0, margin: 0 }}>
          {() => (
            <button
              type="submit"
              style={{ display: 'none' }}
              ref={hiddenSubmitRef}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseImportExcelModal;
