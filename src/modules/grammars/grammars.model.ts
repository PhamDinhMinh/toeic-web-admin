export interface IGrammarResponse {
  id: number;
  title: string;
  content: string;
  isWatched: boolean;
  type: number;
  creatorId: number;
  creationTime: any;
}

export interface IParamsGet {
  type?: number;
  keyword?: string;
  skipCount: number;
  maxResultCount: number;
}

export enum EGrammarType {
  BASIC = 1,
  ADVANCED = 2,
}
