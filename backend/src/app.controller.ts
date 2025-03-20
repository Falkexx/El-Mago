import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { InfraCredentialsManagerService } from './Application/Infra/InfraCredentialsManager/infraCredentialsManager.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly infraCredentialsManager: InfraCredentialsManagerService,
  ) {}

  @Get()
  async getHello() {
    return {
      message: 'Accessed',
    };
  }
}
