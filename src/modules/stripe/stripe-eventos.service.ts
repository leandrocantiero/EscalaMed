import { Injectable, NotFoundException } from "@nestjs/common";
import { EmpresaService } from "../empresas/empresa.service";

@Injectable()
export class EventosService {
    constructor(
        private readonly empresaService: EmpresaService,
    ) { }

    private async pagamentoBemSucedido(dados: any) {
        const clienteId = dados['customer'];
        const empresa = await this.empresaService.obterPorIdStripe(clienteId);

        if (!empresa) {
            throw new NotFoundException('Cliente|Empresa não localizado(a)');
        }

        this.empresaService.salvarDadosStripe(
            empresa,
            {
                stripeAssinaturaAtiva: true,
                stripeDataUltimoPagamento: new Date().toISOString(),
                stripeFaturaAberta: false,
                stripeLinkFatura: dados['hosted_invoice_url'],
                stripeLinkFaturaPdf: dados['invoice_pdf'],
                stripeFalhasPagamento: 0
            }
        );
    }

    private async faturaCriada(dados: any) {
        const clienteId = dados['customer'];
        const empresa = await this.empresaService.obterPorIdStripe(clienteId);

        if (!empresa) {
            throw new NotFoundException('Cliente|Empresa não localizado(a)');
        }

        this.empresaService.salvarDadosStripe(
            empresa,
            {
                stripeFaturaAberta: true,
                stripeLinkFatura: dados['hosted_invoice_url'],
                stripeLinkFaturaPdf: dados['invoice_pdf'],
                stripeFalhasPagamento: 0
            }
        );
    }

    private async assinaturaCancelada(dados: any) {
        const clienteId = dados['customer'];
        const empresa = await this.empresaService.obterPorIdStripe(clienteId);

        if (!empresa) {
            throw new NotFoundException('Cliente|Empresa não localizado(a)');
        }

        this.empresaService.salvarDadosStripe(
            empresa,
            {
                stripeAssinaturaAtiva: false,
            }
        );
    }

    private async pagamentoFalhou(dados: any) {
        const clienteId = dados['customer'];
        const empresa = await this.empresaService.obterPorIdStripe(clienteId);

        if (!empresa) {
            throw new NotFoundException('Cliente|Empresa não localizado(a)');
        }

        if (empresa.stripeFalhasPagamento >= 3) {
            return this.empresaService.salvarDadosStripe(empresa, {
                stripeAssinaturaAtiva: false,
            });
        }

        this.empresaService.salvarDadosStripe(empresa, {
            stripeFalhasPagamento: empresa.stripeFalhasPagamento + 1,
        });
    }
}