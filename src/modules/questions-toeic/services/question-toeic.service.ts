import httpService from '@/shared/http-service';

class QuestionToeic {
  endpoint = '/api/services/app/Question';

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

const questionToeic = new QuestionToeic();
export default questionToeic;
