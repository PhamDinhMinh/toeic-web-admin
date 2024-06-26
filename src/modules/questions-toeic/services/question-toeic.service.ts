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

  updateQuestionSingle(params: any) {
    return httpService.request<void>({
      url: this.endpoint + '/UpdateQuestionSingle',
      method: 'PUT',
      data: params,
    });
  }

  deleteQuestionSingle(id: number) {
    return httpService.request<void>({
      url: this.endpoint + '/DeleteQuestionSingle',
      method: 'DELETE',
      params: {
        id: id,
      },
    });
  }

  updateQuestionGroup(params: any) {
    return httpService.request<void>({
      url: this.endpoint + '/UpdateQuestionGroup',
      method: 'PUT',
      data: params,
    });
  }

  deleteQuestionGroup(id: number) {
    return httpService.request<void>({
      url: this.endpoint + '/DeleteQuestionGroup',
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
