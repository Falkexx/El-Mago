import { env } from '#utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { InfraCredentialsManagerService } from '../../InfraCredentialsManager/infraCredentialsManager.service';

export type SendMailProps = {
  name: string;
  emails: string[];
  subject: string;
  text: string;
  htmlContent: string;
};

@Injectable()
export class NodemailerService {
  private transport: Nodemailer.Transporter;

  constructor(
    private readonly infraCredentialsManager: InfraCredentialsManagerService,
  ) {
    this.getTheCreateTransport();
  }

  async send(props: SendMailProps): Promise<SMTPTransport.SentMessageInfo> {
    if (!this.transport) {
      throw new Error('O transporte de e-mail ainda não foi inicializado.');
    }

    if (!this.transport) {
      throw new InternalServerErrorException('transport invalid');
    }

    return await this.transport.sendMail({
      from: `"El-Mago support 👻" <${env.MAIL_COMPANY}>`,
      to: props.emails.join(', '),
      subject: props.subject,
      text: props.text,
      html: props.htmlContent,
    });
  }

  private async getTheCreateTransport() {
    if (env.MAIL_PROVIDER === 'MAILTRAP') {
      this.transport = Nodemailer.createTransport({
        host: env.MAILTRAP_HOST,
        port: env.MAILTRAP_PORT,
        auth: {
          user: env.MAILTRAP_USER,
          pass: env.MAILTRAP_PASS,
        },
      });
    } else if (env.MAIL_PROVIDER === 'GMAIL') {
      const accessAndRefresh =
        (await this.infraCredentialsManager.getGmailAccessToken()) as string;

      this.transport = Nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'join.legends.company@gmail.com',
          clientId: env.GOOGLE_CLOUD_OAUTH_CLIENT_ID,
          clientSecret: env.GOOGLE_CLOUD_OAUTH_CLIENT_SECRET,
          refreshToken: accessAndRefresh['refreshToken'],
          accessToken: accessAndRefresh['accessToken'],
        },
      });
    } else {
      throw new Error(`Provedor de e-mail não suportado: ${env.MAIL_PROVIDER}`);
    }
  }
}
