import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Remove caracteres não numéricos
          const cpf = value.replace(/[^\d]+/g, '');

          // Verifica se tem 11 dígitos e não é uma sequência repetida (ex: 111.111.111-11)
          if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

          // Validação do primeiro dígito verificador
          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(9))) return false;

          // Validação do segundo dígito verificador
          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
          }
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(10))) return false;

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid CPF`;
        },
      },
    });
  };
}
