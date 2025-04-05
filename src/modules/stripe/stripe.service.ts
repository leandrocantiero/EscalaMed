import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { Empresa } from '../empresas/entities/empresa.entity';
import { Exception } from 'handlebars';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private stripe: Stripe) { }

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

  async criarSessaoCheckout(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const checkout = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-canceled`,
    });

    return checkout;
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
    switch (event.type) {
      case 'payment_intent.created':
        break;
      case 'payment_intent.succeeded':
        break;
      default:
        throw new BadRequestException('Evento não suportado');
    }
  }
}
