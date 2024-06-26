import httpService from '@/shared/http-service';
import { TNotPaginated, TPaginated } from '@/shared/types/paginated.type';

import {
  ICreateInput,
  IParamsGet,
  IResponseDetailExam,
  IResponseExamAll,
} from './exams.model';

class ExamService {
  endpoint = '/api/services/app/ExamToeic';

  create(input: ICreateInput) {
    return httpService.request<any>({
      url: this.endpoint + '/Create',
      method: 'POST',
      data: input,
    });
  }

  createRandom(input: ICreateInput) {
    return httpService.request<any>({
      url: this.endpoint + '/CreateRandom',
      method: 'POST',
      data: input,
    });
  }

  getAll(input: IParamsGet) {
    return httpService.request<TPaginated<IResponseExamAll>>({
      url: this.endpoint + '/GetAll',
      method: 'GET',
      params: input,
    });
  }

  getById(input: { id: number }) {
    return httpService.request<TNotPaginated<IResponseDetailExam>>({
      url: this.endpoint + '/GetById',
      method: 'GET',
      params: input,
    });
  }

  update(input: any) {
    return httpService.request<any>({
      url: this.endpoint + '/Update',
      method: 'PUT',
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

const examService = new ExamService();
export default examService;
