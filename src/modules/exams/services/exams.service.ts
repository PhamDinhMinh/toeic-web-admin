import httpService from '@/shared/http-service';

import { ICreateInput } from './exams.model';

class ExamService {
  endpoint = '/api/services/app/ExamToeic';

  create(input: ICreateInput) {
    return httpService.request<any>({
      url: this.endpoint + '/Create',
      method: 'POST',
      data: input,
    });
  }
}

const examService = new ExamService();
export default examService;
