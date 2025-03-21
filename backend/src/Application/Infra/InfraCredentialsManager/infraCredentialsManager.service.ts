import { ExceptionType, GoogleOauth2Response } from '#types';
import { env } from '#utils';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { KEY_CACHE } from 'src/@metadata/keys';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class InfraCredentialsManagerService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPaypalAccessToken() {
    const accessToken = await this.cacheManager.get(
      KEY_CACHE.paypal_access_token,
    );

    console.log(accessToken);
    if (!accessToken) {
      return this.generateNewPaypalAccessToken();
    }

    return accessToken;
  }

  async getGmailAccessToken() {
    const accessToken = await this.cacheManager.get(
      KEY_CACHE.gmail_access_token,
    );

    if (!accessToken) {
      return this.generateNewGmailAccessToken();
    }

    return accessToken;
  }

  private async generateNewPaypalAccessToken() {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString('base64');

    const url = `${env.PAYPAL_BASE_URL}/v1/oauth2/token`;

    try {
      const response = await this.httpService.axiosRef(url, {
        method: 'POST',
        data: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      await this.cacheManager.set(
        KEY_CACHE.paypal_access_token,
        expiresIn - 1000, // remove 1s to avoid error.
      );

      return accessToken;
    } catch (e) {
      console.log('Erro ao obter o token: ', e.response.data);
      throw new InternalServerErrorException({
        message: {
          engUs: 'internal server error',
          ptBr: 'erro interno no servidor',
          esp: 'error del internal servidor',
        },
      } as ExceptionType);
    }
  }

  private async generateNewGmailAccessToken() {
    const body = {
      refresh_token: env.GOOGLE_CLOUD_OAUTH_REFRESH_TOKEN,
      token_uri: 'https://oauth2.googleapis.com/token',
    };

    const result = await lastValueFrom(
      this.httpService
        .post<GoogleOauth2Response>(
          'https://developers.google.com/oauthplayground/refreshAccessToken',
          body,
        )
        .pipe(map((response) => response.data)),
    );

    await this.cacheManager.set(
      KEY_CACHE.gmail_access_token,
      JSON.stringify({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      }),
      result.expires_in - 500,
    );

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    };
  }
}
