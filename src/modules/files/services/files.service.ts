import httpService from '@/shared/http-service';

class FileService {
  endpoint = '/api/services/app/Upload';

  uploadImages(input: any) {
    return httpService.request<any>({
      url: this.endpoint + '/UploadImages',
      method: 'POST',
      data: input,
    });
  }

  uploadFiles(input: any) {
    return httpService.request<any>({
      url: this.endpoint + '/UploadFiles',
      method: 'POST',
      data: input,
    });
  }
}

const fileService = new FileService();
export default fileService;
