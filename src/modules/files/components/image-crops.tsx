import {
  EditOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, ButtonProps, Divider, Flex, Modal, theme } from 'antd';
import { useRef, useState } from 'react';
import { Cropper, ReactCropperElement, ReactCropperProps } from 'react-cropper';

type TImageCropperProps = ReactCropperProps & {
  onOk?: (blob: Blob) => void;
  buttonProps?: ButtonProps;
};

let flipX = 1;
let flipY = 1;

const ImageCropper = ({
  src,
  onOk,
  buttonProps,
  ...props
}: TImageCropperProps) => {
  const {
    token: { colorPrimary, colorPrimaryBg },
  } = theme.useToken();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOk = () => {
    if (!src) return;
    cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
      if (!blob) {
        setIsModalOpen(false);
        return;
      }
      onOk?.(blob);
      setIsModalOpen(false);
    });
  };

  return (
    <>
      <Button
        size="small"
        icon={<EditOutlined />}
        type="text"
        className="upload-list-item-btn-edit"
        onClick={() => setIsModalOpen(true)}
        style={{ color: colorPrimary, background: colorPrimaryBg }}
        {...buttonProps}
      >
        {buttonProps?.children}
      </Button>
      <Modal
        open={isModalOpen}
        title="Tùy chọn cắt ảnh"
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        //
        footer={(originNode) => (
          <Flex align="center" justify="space-between">
            <Flex gap={8} align="center">
              <Button
                type="text"
                icon={<RotateLeftOutlined />}
                onClick={() => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    cropperRef.current?.cropper?.rotate(-90);
                  }
                }}
              />
              <Button
                type="text"
                icon={<RotateRightOutlined />}
                onClick={() => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    cropperRef.current?.cropper?.rotate(90);
                  }
                }}
              />

              <Divider type="vertical" style={{ margin: 0 }} />

              <Button
                type="text"
                icon={<SwapOutlined />}
                onClick={() => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    flipX = -flipX;
                    cropperRef.current?.cropper?.scaleX(flipX);
                  }
                }}
              />
              <Button
                type="text"
                icon={<SwapOutlined style={{ transform: 'rotate(90deg)' }} />}
                onClick={() => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    flipY = -flipY;
                    cropperRef.current?.cropper?.scaleY(flipY);
                  }
                }}
              />
            </Flex>

            <Flex gap={8} align="center">
              <Divider type="vertical" style={{ margin: 0 }} />
              {originNode}
            </Flex>
          </Flex>
        )}
      >
        <Cropper
          src={src}
          style={{ height: 300, width: '100%' }}
          autoCropArea={1}
          initialAspectRatio={1}
          guides={true}
          ref={cropperRef}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          checkOrientation={false}
          aspectRatio={1}
          {...props}
        />
      </Modal>
    </>
  );
};

export default ImageCropper;
