import { HttpService } from '@nestjs/axios';
import { InfraCredentialsManagerService } from '../../InfraCredentialsManager/infraCredentialsManager.service';
import { env } from '#utils';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class PaypalWebHookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly infraCredentialsManagerModule: InfraCredentialsManagerService,
  ) {}

  async webhookResult(body: WebhookEvent, headers: any) {
    await this.WebHookParser(body, headers);

    if (body.resource.status === 'APPROVED') {
      // CALL QUEUE TO PROCESS ORDER
      // SEND EMAIL TO CUSTOMER
      // SEND EMAIL TO ADMIN
    }
  }

  private async WebHookParser(body: any, headers: any) {
    const paypalAccessToken =
      await this.infraCredentialsManagerModule.getPaypalAccessToken();

    const verificationData = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: env.WEB_HOOK_ID,
      webhook_event: body,
    };

    try {
      const response = await this.httpService.axiosRef.post(
        `${env.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
        verificationData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paypalAccessToken}`,
          },
        },
      );

      if (response.data.verification_status !== 'SUCCESS') {
        throw new HttpException('Sgnature invalid', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
