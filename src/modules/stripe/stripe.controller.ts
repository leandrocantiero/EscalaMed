import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  BadRequestException,
  UseGuards,
  HttpCode,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StripeDto } from './dtos/stripe.dto';
import { EmpresaService } from '../empresas/empresa.service';
import Stripe from 'stripe';

@ApiBearerAuth('JWT-auth')
@Controller('pagamentos')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly empresaService: EmpresaService,
  ) {}

  // @UseGuards(AuthGuard)
  @Post('criar-sessao-checkout')
  async criarSessaoCheckout(@Body() request: StripeDto) {
    let empresa = await this.empresaService.obterPorId(request.empresaId);
    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (!empresa.stripeCustomerId) {
      const clienteCriado = await this.stripeService.criarCliente(empresa);
      console.log('clienteCriado', clienteCriado);
      empresa = await this.empresaService.salvarDadosStripe(
        empresa,
        clienteCriado,
      );
    }

    console.log('empresa', empresa);

    const sessao = await this.stripeService.criarSessaoCheckout(
      empresa.stripeCustomerId,
      request.priceId,
    );

    return { sessao };
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
