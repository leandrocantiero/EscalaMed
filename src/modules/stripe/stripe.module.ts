import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { EmpresaModule } from '../empresas/empresa.module';

@Module({
  imports: [ConfigModule, EmpresaModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService): Stripe => {
        return new Stripe(
          configService.get<string>('STRIPE_SECRET_KEY') ?? '',
          { apiVersion: '2025-02-24.acacia' },
        );
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
