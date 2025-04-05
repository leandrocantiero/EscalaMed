import { BaseEntity } from 'src/common/entities/base.entity';
import { Empresa } from 'src/modules/empresas/entities/empresa.entity';
import { Especialidade } from 'src/modules/especialidades/entities/especialidade.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Funcionario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column()
  rg: string;

  @Column()
  crm: string;

  @Column()
  dataNascimento: Date;

  @Column()
  telefone: string;

  @Column({ default: true })
  isAtivo: boolean;

  @ManyToOne(() => Especialidade, (especialidade) => especialidade.funcionarios)
  @JoinColumn({ name: 'specialtyId' })
  especialidade: Especialidade;

  @ManyToOne(() => Empresa, { nullable: false })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;
}
