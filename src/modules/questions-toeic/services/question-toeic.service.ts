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
}

const questionToeicService = new QuestionToeicService();
export default questionToeicService;
