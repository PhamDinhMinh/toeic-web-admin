import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import {
  IParamsGetSingle,
  IQuestionSingleResponse,
} from './question-toeic.model';

class QuestionToeicService {
  endpoint = '/api/services/app/Question';

  getListSingleQuestion(input: IParamsGetSingle) {
    return httpService.request<TPaginated<IQuestionSingleResponse>>({
      url: this.endpoint + '/GetListQuestionSingle',
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
