export type TUser = {
  id: number;
  userName: string;
  name: string;
  emailAddress: string;
  phoneNumber?: string;
  creationTime: string;
  role?: string;
  dateOfBirth?: any;
  gender?: string;
  imageUrl?: string;
  coverAvatarUrl?: string;
};

export enum EUserGender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Khác',
}

export enum EUserRole {
  ADMIN = 'Admin',
  USER = 'User',
}
