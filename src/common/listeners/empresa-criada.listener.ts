import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from 'src/modules/email/email.service';
import { Empresa } from 'src/modules/empresas/entities/empresa.entity';

@Injectable()
export class EmpresaCriadaListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('empresa.criada')
  async handleEmpresaCriadaEvent(empresa: Empresa): Promise<void> {
    const { nome, email } = empresa;

    if (
      await this.emailService.enviarEmail({
        para: email,
        assunto: 'Bem-vindo ao EscalaMed!',
        template: 'welcome',
        context: { nome },
      })
    ) {
      console.log(`E-mail de boas-vindas enviado para ${email}`);
    } else {
      console.log(`Falha ao enviar e-mail de boas-vindas para ${email}`);
    }
  }
}
