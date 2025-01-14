import { Module } from '@nestjs/common';
import { NodemailerService } from './Nodemailer/Nodemailer.service';

@Module({ providers: [NodemailerService], exports: [NodemailerService] })
export class MailModule {}
