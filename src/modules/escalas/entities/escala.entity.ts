import { StatusEscalaEnum } from "src/common/constants/status-escala.enum";
import { TipoEscalaEnum } from "src/common/constants/tipo-escala.enum";
import { TurnoEnum } from "src/common/constants/turno.enum";
import { Empresa } from "src/modules/empresas/entities/empresa.entity";
import { Especialidade } from "src/modules/especialidades/entities/especialidade.entity";
import { Funcionario } from "src/modules/funcionarios/entities/funcionario.entity";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";

@Entity('escalas')
export class Escala extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    nome: string;

    @Column({ type: 'datetime', nullable: false })
    dataHoraInicio: Date;

    @Column({ type: 'datetime', nullable: false })
    dataHoraFim: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    local?: string;

    @Column({ type: 'text', nullable: true })
    observacoes?: string;

    @Column({ type: 'enum', enum: TurnoEnum })
    turno: TurnoEnum;

    @Column({ type: 'enum', enum: TipoEscalaEnum })
    tipo: TipoEscalaEnum;

    @Column({ type: 'enum', enum: StatusEscalaEnum, default: StatusEscalaEnum.AGENDADA })
    status: StatusEscalaEnum;

    @Column({ default: true })
    isPresencial: boolean;

    @Column({ default: false })
    isConfirmada: boolean;

    @ManyToOne(() => Empresa)
    @JoinColumn({ name: 'empresaId' })
    empresa: Empresa;

    @Column({ type: 'int', nullable: true })
    especialidadeId?: number;

    @ManyToOne(() => Especialidade)
    @JoinColumn({ name: 'especialidadeId' })
    especialidade?: Especialidade;

    @ManyToMany(() => Funcionario)
    @JoinTable({
        name: 'escala_funcionarios',
        joinColumn: { name: 'escalaId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'funcionarioId', referencedColumnName: 'id' },
    })
    funcionarios: Funcionario[];
}