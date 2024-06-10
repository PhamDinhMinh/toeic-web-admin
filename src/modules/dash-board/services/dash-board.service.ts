import httpService from '@/shared/http-service';
import { TNotPaginated } from '@/shared/types/paginated.type';

import { IParamsGetStatistic, IResponseCorrect } from './dash-board.model';

class DashBoardService {
  endpoint = '/api/services/app/Statistics';

  statisticsUser(input: IParamsGetStatistic) {
    return httpService.request<TNotPaginated<any>>({
      url: this.endpoint + '/StatisticsUser',
      method: 'GET',
      params: input,
    });
  }

  statisticsPost(input: IParamsGetStatistic) {
    return httpService.request<TNotPaginated<any>>({
      url: this.endpoint + '/StatisticsPost',
      method: 'GET',
      params: input,
    });
  }

  statisticsQuestion(input: IParamsGetStatistic) {
    return httpService.request<TNotPaginated<any>>({
      url: this.endpoint + '/StatisticsQuestion',
      method: 'GET',
      params: input,
    });
  }

  statisticsCorrectQuestion() {
    return httpService.request<TNotPaginated<IResponseCorrect>>({
      url: this.endpoint + '/StatisticsCorrectQuestion',
      method: 'GET',
    });
  }
}

const dashBoardService = new DashBoardService();
export default dashBoardService;
