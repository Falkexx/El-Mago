import { Module } from '@nestjs/common';
import { AdminController } from './Admin.controller';
import { AdminService } from './Admin.service';
import { AffiliateModule } from '../Affiliate/Affiliate.module';

@Module({
  imports: [AffiliateModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
