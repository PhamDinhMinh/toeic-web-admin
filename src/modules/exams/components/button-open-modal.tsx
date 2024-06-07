import { Button, Flex, Modal, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import ModalSelectQuestionGroup from './modal-select-question-group';
import ModalSelectQuestionSingle from './modal-select-question-single';

type TButtonOpenModal = {
  value?: any;
  onChange?: (newValue?: React.Key[]) => void;
  partId: number;
  name: string;
  form: any;
};

function ButtonOpenModal({
  value,
  onChange,
  partId,
  form,
  name,
}: TButtonOpenModal) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(value);
  const [rowData, setRowData] = useState<any>([]);
  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = () => {
    onChange?.(selectedRowKeys);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const quantity = useMemo(() => {
    let count = 0;
    rowData?.map((item: any) => {
      count += item?.questions?.length;
    });
    if (rowData?.length === 0 && value?.length === 15) {
      return 54;
    }
    return count;
  }, [rowData, value?.length]);

  useEffect(() => {
    if (value) {
      setSelectedRowKeys([...value]);
    }
  }, [value]);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography>
          Đã chọn{' '}
          <Typography.Text style={{ fontWeight: '600' }}>
            {partId === EExamTipsType.Part7
              ? quantity
              : partId === EExamTipsType.Part3 || partId === EExamTipsType.Part4
                ? (form.getFieldValue(name)?.length ?? 0) * 3
                : partId === EExamTipsType.Part6
                  ? (form.getFieldValue(name)?.length ?? 0) * 4
                  : form.getFieldValue(name)?.length ?? 0}
          </Typography.Text>{' '}
          câu
        </Typography>
        <Button type="dashed" onClick={showModal}>
          Chọn câu hỏi
        </Button>
      </Flex>
      <Modal
        title="Thêm câu hỏi"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={(screen.width * 4) / 5}
        style={{ marginTop: -40 }}
      >
        {partId === 1 || partId === 2 || partId === 5 ? (
          <ModalSelectQuestionSingle
            partId={partId}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        ) : (
          <ModalSelectQuestionGroup
            partId={partId}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            setRowData={setRowData}
          />
        )}
      </Modal>
    </>
  );
}

export default ButtonOpenModal;
