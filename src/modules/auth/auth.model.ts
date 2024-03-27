export type TLoginInput = {
  userNameOrEmail: string;
  password: string;
};

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

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TRegisterInput = {
  fullName: string;
  emailAddress: string;
  password: string;
  userName: string;
  phoneNumber?: string;
};

export type TRefreshTokenInput = {
  refreshToken: string;
};
