import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';
import { EmpresaController } from './empresas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  providers: [EmpresaService],
  exports: [EmpresaService],
  controllers: [EmpresaController],
})
export class EmpresaModule {}
