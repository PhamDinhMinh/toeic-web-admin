/* eslint-disable react/jsx-no-target-blank */

/* eslint-disable no-extra-boolean-cast */
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Image, Typography, UploadFile } from 'antd';
import prettyBytes from 'pretty-bytes';
import { useRef } from 'react';

import ImageCropper from './image-crops';

type TUploadItemProps = {
  file: UploadFile<any>;
  onCrop?: (newFile: any) => void;
  onClickRemove?: () => void;
};

const UploadItem = ({ file, onCrop, onClickRemove }: TUploadItemProps) => {
  const fileUrlsRef = useRef<string[]>([]);
  const prevFileUrls = fileUrlsRef.current;

  const fileUrl =
    typeof file.originFileObj === 'object'
      ? URL.createObjectURL(file.originFileObj as any)
      : '';

  const handleOkCrop = (blob: Blob) => {
    const { type, name, uid, originFileObj } = file;
    const lastModifiedDate = new Date();
    const lastModified = Date.now();

    // save for cropping the originFile
    fileUrlsRef.current.push(URL.createObjectURL(originFileObj as any));

    const newFile = new File([blob], name, { type });
    Object.assign(newFile, { uid });

    onCrop?.({
      ...file,
      size: newFile.size,
      lastModifiedDate,
      lastModified,
      originFileObj: newFile as any,
    });
  };

  return (
    <Flex
      gap={8}
      style={{ border: '1px solid #eee', padding: 8, borderRadius: 8 }}
    >
      {!!file?.thumbUrl ? (
        <Image
          wrapperStyle={{ flexShrink: 0, border: '1px solid #eee' }}
          preview={{ src: fileUrl }}
          src={fileUrl}
          style={{ objectFit: 'contain', width: 56, height: 56 }}
        />
      ) : (
        <a href={fileUrl} target="_blank" style={{ flexShrink: 0 }}>
          <Avatar shape="square" size={58} icon={<FileTextOutlined />} />
        </a>
      )}
      <Flex
        vertical
        justify="space-between"
        style={{ flex: '1 1 auto', minWidth: 0 }}
      >
        <Typography.Paragraph
          strong
          ellipsis={{ rows: 2 }}
          style={{ margin: 0, lineHeight: 1.15, maxWidth: '100%' }}
        >
          {file?.name}
        </Typography.Paragraph>
        {!!file?.size && (
          <Typography.Text type="secondary">
            {prettyBytes(file.size)}
          </Typography.Text>
        )}
      </Flex>
      <Flex
        vertical
        justify="space-between"
        style={{ marginLeft: 'auto', flexShrink: 0 }}
      >
        <Button
          size="small"
          icon={<DeleteOutlined />}
          type="text"
          className="upload-list-item-btn-remove"
          onClick={() => {
            URL.revokeObjectURL(fileUrl);
            prevFileUrls.forEach((u) => {
              URL.revokeObjectURL(u);
            });
            fileUrlsRef.current = [];
            onClickRemove?.();
          }}
        ></Button>
        {!!file?.thumbUrl && (
          <ImageCropper
            src={!!prevFileUrls?.length ? prevFileUrls[0] : fileUrl}
            onOk={handleOkCrop}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default UploadItem;
