import { BaseEntity } from 'src/common/entities/base.entity';
import { Empresa } from 'src/modules/empresas/entities/empresa.entity';
import { Funcionario } from 'src/modules/funcionarios/entities/funcionario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('especialidade')
export class Especialidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @OneToMany(() => Funcionario, (funcionario) => funcionario.especialidade)
  funcionarios?: Funcionario[];

  @ManyToOne(() => Empresa, { nullable: false })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;
}
