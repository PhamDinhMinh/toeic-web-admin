import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { IGrammarResponse, IParamsGet } from './grammars.model';

class GrammarService {
  endpoint = '/api/services/app/Grammar';

  getList(input: IParamsGet) {
    return httpService.request<TPaginated<IGrammarResponse>>({
      url: this.endpoint + '/GetAll',
      method: 'GET',
      params: input,
    });
  }

  getDetail(id: number) {
    return httpService.request<any>({
      url: `/api/estates/admin/${id}`,
      method: 'GET',
    });
  }

  create(input: any) {
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

const grammarService = new GrammarService();
export default grammarService;
