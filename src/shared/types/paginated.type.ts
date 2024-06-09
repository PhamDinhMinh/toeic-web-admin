export type TPaginated<T> = {
  data: T[];
  totalRecords: number;
};

export type TNotPaginated<T> = {
  data: T;
  totalRecords: number;
};
