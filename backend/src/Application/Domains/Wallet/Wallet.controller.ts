import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './Wallet.service';
import { JwtAuthGuard } from 'src/@guards/jwt-auth.guard';
import { RoleGuard } from 'src/@guards/role.guard';
import { ROLE, RolesDecorator } from 'src/utils/role';
import { User } from '../Auth/decorators/User.decorator';
import { ApiResponse, PayloadType } from '#types';
import { CreateWalletToAffiliateDto } from './Dtos/CreateWalletToAffiliate.dto';
import { WalletEntity } from 'src/Application/Entities/Wallet.entity';

@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.AFFILIATE)
  async getWallet(
    @User() payload: PayloadType,
  ): Promise<ApiResponse<WalletEntity>> {
    const result = await this.walletService.getWallet(payload);
    return {
      data: result,
      message: 'success',
      status: 200,
    };
  }

  @Post('create-wallet-to-affiliate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RolesDecorator(ROLE.ADMIN)
  async createWalletToAffiliate(
    @Body() walletDto: CreateWalletToAffiliateDto,
  ): Promise<ApiResponse<WalletEntity>> {
    const result = await this.walletService.createWalletToAffiliate(walletDto);

    return {
      data: result,
      message: 'success',
      status: 201,
      href: 'require implement',
    };
  }
}
