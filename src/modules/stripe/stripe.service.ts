import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { Empresa } from '../empresas/entities/empresa.entity';
import { EmpresaService } from '../empresas/empresa.service';
import { StripeDto } from './dtos/stripe.dto';
import { EventosService } from './stripe-eventos.service';

@Injectable()
export class StripeService {
  private eventosValidos = {
    'invoice.created': 'faturaCriada',
    'payment_intent.succeeded': 'pagamentoBemSucedido',
    'customer.subscription.deleted': 'assinaturaCancelada',
    'payment_intent.canceled': 'pagamentoFalhou',
    'payment_intent.payment_failed': 'pagamentoFalhou'
  };

  constructor(
    @Inject('STRIPE_CLIENT') private stripe: Stripe,
    private readonly empresaService: EmpresaService,
    private readonly eventosService: EventosService,
  ) { }

  async obterProdutos(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list({
      ids: ['prod_S4NH94rzstKcmV'],
    });
    return products.data;
  }

  async obterClientes(): Promise<Stripe.Customer[]> {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }

  async obterPrecos(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({});
    return prices.data;
  }

  async criarCliente(empresa: Empresa): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email: empresa.email,
      name: empresa.nome,
      phone: empresa.telefonePrimario ?? '',
    });
    return customer;
  }

  async criarAssinatura(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }

  async criarSessaoCheckout(request: StripeDto): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    let empresa = await this.empresaService.obterPorId(request.empresaId);
    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (!empresa.stripeCustomerId) {
      const clienteCriado = await this.criarCliente(empresa);
      empresa = await this.empresaService.salvarDadosStripe(
        empresa,
        {
          stripeClienteId: clienteCriado.id,
        },
      );
    }

    const checkout = await this.stripe.checkout.sessions.create({
      customer: empresa.stripeClienteId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: request.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-canceled`,
    });

    return checkout;
  }

  async obterFaturasPorEmpresaId(empresaId: number): Promise<Stripe.Invoice[]> {
    const empresa = await this.empresaService.obterPorId(empresaId);
    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const faturas = await this.stripe.invoices.list({
      customer: empresa.stripeClienteId,
      limit: 10,
      expand: ['data.subscription']
    });

    return faturas.data;
  }

  constructEvent(
    payload: Buffer | undefined,
    signature: string,
    secret: string,
  ): Stripe.Event {
    if (!payload) {
      throw new BadRequestException('Payload do evento não encontrado');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  async webhook(event: Stripe.Event) {
    const acao = this.eventosValidos[event.type]
    if (!acao) {
      throw new BadRequestException('Evento não suportado');
    }

    await this.eventosService[acao](event.data?.object);
    console.log(`evento ${acao} recebido e processado com sucesso`);
  }
}
