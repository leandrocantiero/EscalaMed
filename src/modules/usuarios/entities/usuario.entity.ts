import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nome: string;

  @Column({ type: 'text', nullable: true })
  cpf: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'text', nullable: true })
  telefone: string;

  @Column({ type: 'text' })
  senha: string;

  @Column({ default: true })
  isAtivo: boolean;

  @Column({ type: 'text', nullable: true })
  foto?: string;

  @Column('simple-array')
  permissoes?: string[];
}
