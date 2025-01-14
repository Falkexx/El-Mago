import { env } from '#utils';
import { Injectable } from '@nestjs/common';
import * as Nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type SendMailProps = {
  name: string;
  emails: string[];
  subject: string;
  text: string;
  htmlContent: string;
};

@Injectable()
export class NodemailerService {
  private transport: Nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor() {
    this.transport = this.getTheCreateTransport();
  }

  async send(props: SendMailProps) {
    await this.transport.sendMail({
      from: `"El-Mago support 👻" <${env.MAIL_COMPANY}>`,
      to: props.emails.join(', '),
      subject: props.subject,
      text: props.text,
      html: props.htmlContent,
    });
  }

  private getTheCreateTransport() {
    if (env.MAIL_PROVIDER === 'MAILTRAP') {
      return Nodemailer.createTransport({
        host: env.MAILTRAP_HOST,
        port: env.MAILTRAP_PORT,
        auth: {
          user: env.MAILTRAP_USER,
          pass: env.MAILTRAP_PASS,
        },
      });
    }

    if (env.MAIL_PROVIDER === 'GMAIL') {
      // return gmail provider.
    }
  }
}
