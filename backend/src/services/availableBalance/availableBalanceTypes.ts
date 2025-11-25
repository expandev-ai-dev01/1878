/**
 * @summary
 * Type definitions for available balance service operations.
 * Defines interfaces for available balance request and response structures.
 *
 * @module services/availableBalance/availableBalanceTypes
 */

export interface AvailableBalanceGetRequest {
  idAccount: number;
}

export interface AvailableBalanceResponse {
  orcamento_mensal: number;
  total_gastos_mes: number;
  saldo_disponivel: number;
  percentual_utilizado: number | null;
  status_saldo: 'positivo' | 'negativo' | 'alerta' | 'indefinido';
  mes_referencia: Date;

  // Display fields
  valor_formatado: string;
  cor_indicador: 'green' | 'red' | 'yellow' | 'gray';
  mensagem_status: string;
  valor_percentual_formatado: string;
  progresso_barra: number;
  cor_barra_progresso: 'green' | 'red' | 'yellow' | 'gray';

  container_mensagem_sem_orcamento: {
    visivel: boolean;
    mensagem: string;
    acao: string;
  };
}
