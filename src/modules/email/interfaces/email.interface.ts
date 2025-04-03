export interface EmailOptions {
  para: string;
  assunto: string;
  template?: string; // Nome do template (ex: 'welcome.hbs')
  context?: { [key: string]: any }; // Dados para o template
  texto?: string; // Corpo em texto puro
  html?: string; // HTML personalizado (opcional)
  anexos?: Array<{
    filename: string;
    content?: Buffer;
    path?: string;
  }>;
}
