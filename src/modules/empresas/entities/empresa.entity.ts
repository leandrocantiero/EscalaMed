import { IsEmail, IsUrl } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('empresa')
export class Empresa extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nome: string;

  @Column({ type: 'text' })
  fantasia: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  cnpj: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({ type: 'text', nullable: true })
  inscricaoEstadual: string | null;

  @Column({ type: 'text', nullable: true })
  inscricaoMunicipal: string | null;

  @Column({ type: 'text', nullable: true })
  telefonePrimario: string | null;

  @Column({ type: 'text', nullable: true })
  telefoneSecundario: string | null;

  @Column({ type: 'text', nullable: true })
  @IsUrl()
  website: string | null;

  @Column({ default: true })
  isAtivo: boolean;

  // Dados fiscais e tributários
  @Column({ type: 'text', nullable: true })
  regimeTributario: string | null;

  @Column({ type: 'text', nullable: true })
  codigoCnae: string | null;

  @Column({ type: 'text', nullable: true })
  descricaoCnae: string | null;

  @Column({ type: 'boolean', default: false })
  isSimplesNacional: boolean;

  @Column({ type: 'boolean', default: false })
  isIncentivoFiscal: boolean;

  @Column({ type: 'boolean', default: false })
  isIncentivoCultural: boolean;

  // Relacionamentos
  @OneToMany(() => Usuario, (item) => item.empresaId)
  usuarios?: Usuario[];

  @OneToOne(() => Usuario, (item) => item.id)
  createdBy?: Usuario;

  @OneToOne(() => Usuario, (item) => item.id)
  updatedBy?: Usuario;
}
