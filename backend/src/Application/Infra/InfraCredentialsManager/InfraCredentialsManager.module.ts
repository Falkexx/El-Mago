import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { InfraCredentialsManagerService } from './infraCredentialsManager.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [InfraCredentialsManagerService],
  exports: [InfraCredentialsManagerService],
})
export class InfraCredentialsManagerModule {}
