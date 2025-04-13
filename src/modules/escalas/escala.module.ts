import { Escala } from "./entities/escala.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EscalaService } from "./escala.service";
import { Module } from "@nestjs/common";
import { EscalaController } from "./escala.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Escala])],
    controllers: [EscalaController],
    providers: [EscalaService],
    exports: [EscalaService],
})
export class EscalaModule { }