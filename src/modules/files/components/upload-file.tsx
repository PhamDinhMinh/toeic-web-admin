import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

const UploadFile = ({ value, onChange }: any) => {
  const props: UploadProps = {
    onRemove: () => {},
    beforeUpload: () => {
      return false;
    },
  };

  return (
    <>
      <Upload
        {...props}
        multiple={false}
        beforeUpload={(file) => {
          const reader = new FileReader();
          reader.readAsText(file);

          // Prevent upload
          return false;
        }}
        fileList={value ? [value] : []}
        onChange={({ file }) => onChange?.(file)}
        accept=".mp3, .mp4"
      >
        <Button icon={<UploadOutlined />}>Chọn file</Button>
      </Upload>
    </>
  );
};

export default UploadFile;
