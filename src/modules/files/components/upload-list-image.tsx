import { InboxOutlined } from '@ant-design/icons';
import { Upload as AntdUpload, UploadFile } from 'antd';

import UploadItem from './upload-item';

type TUploadProps = { value?: any[]; onChange?: (value: any[]) => void };

const UploadImages = ({ value = [], onChange, ...props }: TUploadProps) => {
  const handleCrop = (newFile: UploadFile<any>) => {
    const { uid: nUid, name: nName } = newFile;

    const newFileList = value.map((item) => {
      const { uid, name } = item;
      if (!!uid && !!name ? uid === nUid && name === nName : uid === nUid)
        return newFile;
      return item;
    });
    onChange?.(newFileList);
  };

  return (
    <AntdUpload
      {...props}
      type="drag"
      accept="image/jpg,image/jpeg,image/png"
      onChange={({ fileList }) => onChange?.(fileList)}
      fileList={value}
      multiple
      listType="picture"
      beforeUpload={() => false}
      className="upload-list-inline"
      itemRender={(_, file, _fileList, { remove }) => {
        return (
          <UploadItem
            key={String(file?.originFileObj)}
            file={file}
            onCrop={(newFile) => {
              handleCrop(newFile);
            }}
            onClickRemove={() => {
              remove();
            }}
          />
        );
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
    </AntdUpload>
  );
};

export default UploadImages;
