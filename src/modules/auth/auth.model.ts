export type TLoginInput = {
  userNameOrEmailAddress: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expireInSeconds: number;
  refreshTokenExpireInSeconds: number;
};

export type TRegisterInput = {
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string | Date;
};

export type TRefreshTokenInput = {
  refreshToken: string;
};
