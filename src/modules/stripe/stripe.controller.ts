import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
  UseGuards,
  HttpCode,
  Headers,
  RawBodyRequest,
  Param,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StripeDto } from './dtos/stripe.dto';

@ApiBearerAuth('JWT-auth')
@Controller('pagamentos')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
  ) { }

  // @UseGuards(AuthGuard)
  @Post('criar-sessao-checkout')
  async criarSessaoCheckout(@Body() request: StripeDto) {
    return this.stripeService.criarSessaoCheckout(request);
  }

  // @UseGuards(AuthGuard)
  @Post('obter-faturas/:empresaId')
  async obterFaturas(@Param('empresaId') empresaId: number) {
    return this.stripeService.obterFaturasPorEmpresaId(empresaId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ): Promise<any> {
    try {
      const event = this.stripeService.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET ?? '',
      );

      await this.stripeService.webhook(event);
      return 'ok';
    } catch (err) {
      console.log(err);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
