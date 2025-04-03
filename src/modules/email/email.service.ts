import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EmailOptions } from './interfaces/email.interface';
import { EMAIL_CONFIG } from 'src/common/constants/email';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: {
        user: EMAIL_CONFIG.auth.user,
        pass: EMAIL_CONFIG.auth.pass,
      },
    });
  }

  async enviarEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: EMAIL_CONFIG.from,
        to: options.para,
        subject: options.assunto,
        text: options.texto,
        html: options.template
          ? this.compileTemplate(options.template, options.context)
          : options.html,
        attachments: options.anexos,
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }

  private compileTemplate(templateName: string, context: any): string {
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);
    const template = readFileSync(templatePath, 'utf8');
    return compile(template)(context);
  }
}
