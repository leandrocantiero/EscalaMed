import { Module } from '@nestjs/common';
import { EspecialidadeService } from './especialidade.service';
import { Especialidade } from './entities/especialidade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadeController } from './especialidade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidade])],
  controllers: [EspecialidadeController],
  providers: [EspecialidadeService],
  exports: [EspecialidadeService],
})
export class EspecialidadeModule {}
