import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { ICreateInput, IExamTipsResponse, IParamsGet } from './exam-tips.model';

class ExamTipsService {
  endpoint = '/api/services/app/ExamTips';

  getList(input: IParamsGet) {
    return httpService.request<TPaginated<IExamTipsResponse>>({
      url: this.endpoint + '/GetAll',
      method: 'GET',
      params: input,
    });
  }

  create(input: ICreateInput) {
    return httpService.request<any>({
      url: this.endpoint + '/Create',
      method: 'POST',
      data: input,
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

const examTipsService = new ExamTipsService();
export default examTipsService;
