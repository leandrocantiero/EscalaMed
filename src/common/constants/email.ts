export const EMAIL_CONFIG = {
  host: 'smtp.example.com', // Servidor SMTP (ex: Gmail, SendGrid)
  port: 587,
  secure: false, // true para SSL
  auth: {
    user: 'seu-email@example.com',
    pass: 'sua-senha',
  },
  from: '"Nome do Remetente" <no-reply@example.com>',
};
