import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from 'src/modules/email/email.service';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';

@Injectable()
export class UsuarioCriadoListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('usuario.criado')
  async handleUsuarioCriadoEvent(usuario: Usuario): Promise<void> {
    const { nome, email } = usuario;

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
