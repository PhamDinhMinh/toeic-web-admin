import { Button, Flex, Modal, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

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
  name,
  form,
}: TButtonOpenModal) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    value ?? [],
  );
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
      count += item?.question?.length;
    });
    return count;
  }, [rowData]);
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography>
          Đã chọn{' '}
          <Typography.Text style={{ fontWeight: '600' }}>
            {/* {partId === EExamTipsType.Part3 || partId === EExamTipsType.Part4
              ? (form.getFieldValue(name)?.length ?? 0) * 3
              : form.getFieldValue(name)?.length ?? 0} */}
            {quantity}
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
