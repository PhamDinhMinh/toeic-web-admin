import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/configs/constants';
import httpService from '@/shared/http-service';

import { TUser } from '../users/user.model';
import { TLoginInput, TLoginResponse, TRegisterInput } from './auth.model';

class AuthService {
  public async login(input: TLoginInput) {
    const result = await httpService.requestNoAuth<TLoginResponse>({
      url: '/api/auth/token-auth',
      method: 'POST',
      data: input,
    });

    Cookies.set(ACCESS_TOKEN_KEY, result.data.accessToken);
    Cookies.set(REFRESH_TOKEN_KEY, result.data.refreshToken);

    return this.getMe();
  }

  async register(input: TRegisterInput) {
    const isSuccess = await httpService.requestNoAuth<boolean>({
      url: '/api/auth/register',
      method: 'POST',
      data: input,
    });

    if (isSuccess) {
      return this.login({
        userNameOrEmail: input.userName ?? input.emailAddress,
        password: input.password,
      });
    } else {
      return null;
    }
  }

  async logout() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }

  async refreshToken() {
    try {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        return false;
      }

      const response = await httpService.requestNoAuth<TLoginResponse>({
        url: '/api/auth/refresh-token',
        method: 'POST',
        data: {
          refreshToken,
        },
      });

      Cookies.set(ACCESS_TOKEN_KEY, response.data.accessToken);

      return true;
    } catch (error) {
      return false;
    }
  }

  async getMe() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new Error('Access token is not found');
    }

    return await httpService.request<TUser>({
      url: '/api/auth/me',
      method: 'GET',
    });
  }
}

const authService = new AuthService();

export default authService;
