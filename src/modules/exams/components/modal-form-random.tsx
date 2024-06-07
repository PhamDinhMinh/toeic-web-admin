import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Form, Input, Modal } from 'antd';
import { useRef } from 'react';

import useTranslation from '@/hooks/useTranslation';
import { useAppStore } from '@/modules/app/app.zustand';

import examService from '../services/exams.service';

type TModalFormRandom = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

const ModalFormRandom = ({ openModal, setOpenModal }: TModalFormRandom) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const setLoading = useAppStore((state) => state.setLoading);
  const queryClient = useQueryClient();

  const { message } = App.useApp();

  const { mutate: createMutation } = useMutation({
    mutationFn: (data: any) => examService.createRandom(data),
    onSuccess: async () => {
      setLoading(false);
      queryClient.refetchQueries({ queryKey: ['/exams-list'] });
      message.success(t('Tạo mới thành công'));
      setOpenModal(false);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

  const handleOk = (values: { nameExam: string }) => {
    createMutation(values);
  };
  const hiddenSubmitRef = useRef<any>();

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Modal
        title="Tạo đề thi ngẫu nhiên"
        open={openModal}
        onOk={() => {
          form.submit();
          hiddenSubmitRef.current.click();
        }}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="exam-random"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleOk}
        >
          <Form.Item
            name="nameExam"
            label={t('Tên đề thi')}
            rules={[
              { required: true, message: t('Trường này không được bỏ trống!') },
            ]}
          >
            <Input />
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
      </Modal>
    </>
  );
};

export default ModalFormRandom;
