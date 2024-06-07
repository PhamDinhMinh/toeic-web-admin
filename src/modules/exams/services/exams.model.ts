export interface ICreateInput {
  nameExam: string;
  listQuestionPart1?: number[];
  listQuestionPart2?: number[];
  listQuestionPart3?: number[];
  listQuestionPart4?: number[];
  listQuestionPart5?: number[];
  listQuestionPart6?: number[];
  listQuestionPart7?: number[];
}

export interface IParamsGet {
  keyword?: string;
  orderBy?: boolean;
  skipCount?: number;
  maxResultCount?: number;
}

export interface IResponseExamAll {
  id: number;
  nameExam: string;
  listQuestionPart1: number[];
  listQuestionPart2: number[];
  listQuestionPart3: number[];
  listQuestionPart4: number[];
  listQuestionPart5: number[];
  listQuestionPart6: number[];
  listQuestionPart7: number[];
  creatorId: number;
  creationTime: any;
}
