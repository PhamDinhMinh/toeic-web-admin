import httpService from '@/shared/http-service';

class FileService {
  endpoint = '/api/services/app/Upload';

  async uploadFile(file: any) {
    const submitData = new FormData();
    submitData.append('files', file[0]);
    return await httpService.request<any>({
      url: this.endpoint + '/UploadFiles',
      contentType: 'multipart/form-data',
      method: 'POST',
      data: submitData,
    });
  }

  async uploadImages(images = []) {
    const submitData = new FormData();
    images.forEach((image) => submitData.append('files', image));
    return await httpService.request<any[]>({
      url: this.endpoint + '/UploadImages',
      contentType: 'multipart/form-data',
      method: 'POST',
      data: submitData,
    });
  }
}

const fileService = new FileService();
export default fileService;
