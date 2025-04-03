import { BaseEntity } from 'src/common/entities/base.entity';
import { Funcionario } from 'src/modules/funcionarios/entities/funcionario.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('especialidade')
export class Especialidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Funcionario, (funcionario) => funcionario.especialidade)
  funcionarios?: Funcionario[];
}
