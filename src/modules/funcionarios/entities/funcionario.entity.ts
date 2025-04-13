import { BaseEntity } from 'src/common/entities/base.entity';
import { Empresa } from 'src/modules/empresas/entities/empresa.entity';
import { Escala } from 'src/modules/escalas/entities/escala.entity';
import { Especialidade } from 'src/modules/especialidades/entities/especialidade.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Funcionario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  nome: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  cpf: string;

  @Column({ type: 'varchar', nullable: true })
  rg?: string;

  @Column({ type: 'varchar', nullable: true })
  crm?: string;

  @Column({ type: 'date', nullable: false })
  dataNascimento: Date;

  @Column()
  telefone: string;

  @Column({ default: true })
  isAtivo: boolean;

  @Column({ type: 'integer', nullable: true })
  especialidadeId?: number;

  @ManyToOne(() => Especialidade, (especialidade) => especialidade.funcionarios)
  @JoinColumn({ name: 'especialidadeId' })
  especialidade: Especialidade;

  @ManyToOne(() => Empresa, { nullable: false })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @ManyToMany(() => Escala, escala => escala.funcionarios)
  escalas: Escala[];
}
