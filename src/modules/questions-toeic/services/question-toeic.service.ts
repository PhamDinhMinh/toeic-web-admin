import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  IParamsGet,
  IQuestionGroupResponse,
  IQuestionSingleResponse,
} from './question-toeic.model';

class QuestionToeicService {
  endpoint = '/api/services/app/Question';

  getListSingleQuestion(input: IParamsGet) {
    return httpService.request<TPaginated<IQuestionSingleResponse>>({
      url: this.endpoint + '/GetListQuestionSingle',
      method: 'GET',
      params: input,
    });
  }

  getListGroupQuestion(input: IParamsGet) {
    return httpService.request<TPaginated<IQuestionGroupResponse>>({
      url: this.endpoint + '/GetListQuestionGroup',
      method: 'GET',
      params: input,
    });
  }

  createSingleQuestion(input: any) {
    return httpService.request<any>({
      url: this.endpoint + '/CreateQuestionSingle',
      method: 'POST',
      data: input,
    });
  }

  createGroupQuestion(input: any) {
    return httpService.request<any>({
      url: this.endpoint + '/CreateQuestionGroup',
      method: 'POST',
      data: input,
    });
  }

  delete(id: number) {
    return httpService.request<void>({
      url: this.endpoint + '/Delete',
      method: 'DELETE',
      params: {
        id: id,
      },
    });
  }

  public async importExcel(
    file: File,
    data: {
      [key: string]: any;
    } = {},
  ) {
    const formData = new FormData();
    formData.append('File', file);

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const res = await httpService.request<any>({
      method: 'POST',
      url: '/api/services/app/Question/ImportExcelQuestionSingle',
      data: formData,
      contentType: 'multipart/form-data',
    });

    return res.result;
  }
}

const questionToeicService = new QuestionToeicService();
export default questionToeicService;
