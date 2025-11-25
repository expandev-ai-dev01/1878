export interface AvailableBalance {
  orcamento_mensal: number;
  total_gastos_mes: number;
  saldo_disponivel: number;
  percentual_utilizado: number | null;
  status_saldo: 'positivo' | 'negativo' | 'alerta' | 'indefinido';
  mes_referencia: string;
  valor_formatado: string;
  cor_indicador: 'green' | 'red' | 'yellow' | 'gray';
  mensagem_status: string;
  valor_percentual_formatado: string;
  progresso_barra: number;
  cor_barra_progresso: 'green' | 'red' | 'yellow' | 'gray';
  container_mensagem_sem_orcamento: {
    visible: boolean;
    message: string;
    action_text?: string;
  } | null;
}
