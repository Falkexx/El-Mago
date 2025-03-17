import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { InfraCredentialsManagerService } from './infraCredentialsManager.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [InfraCredentialsManagerService],
  exports: [InfraCredentialsManagerService],
})
export class InfraCredentialsManagerModule {}
