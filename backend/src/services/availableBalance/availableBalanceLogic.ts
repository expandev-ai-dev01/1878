/**
 * @summary
 * Available balance business logic implementation.
 * Calculates remaining balance, status, and visual indicators based on budget and expenses.
 *
 * @module services/availableBalance/availableBalanceLogic
 */

import { AvailableBalanceGetRequest, AvailableBalanceResponse } from './availableBalanceTypes';
import { budgetGet } from '../budget';
import { getExpensesByAccount } from '../expense';

/**
 * @summary
 * Retrieves and calculates the available balance for the current month.
 *
 * @param {AvailableBalanceGetRequest} params - Request parameters
 * @returns {Promise<AvailableBalanceResponse>} Calculated balance data
 */
export async function availableBalanceGet(
  params: AvailableBalanceGetRequest
): Promise<AvailableBalanceResponse> {
  // 1. Get Monthly Budget
  const orcamento_mensal = await budgetGet({ idAccount: params.idAccount });

  // 2. Get Total Expenses for Current Month
  const allExpenses = await getExpensesByAccount(params.idAccount);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = allExpenses.filter((exp) => {
    const expDate = new Date(exp.expenseDate);
    return (
      expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear && !exp.deleted
    );
  });

  const total_gastos_mes = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 3. Calculate Available Balance
  const saldo_disponivel = orcamento_mensal - total_gastos_mes;

  // 4. Calculate Percentage Used
  let percentual_utilizado: number | null = null;
  if (orcamento_mensal > 0) {
    percentual_utilizado = (total_gastos_mes / orcamento_mensal) * 100;
  }

  // 5. Determine Status
  let status_saldo: 'positivo' | 'negativo' | 'alerta' | 'indefinido';
  if (orcamento_mensal === 0) {
    status_saldo = 'indefinido';
  } else if (saldo_disponivel < 0) {
    status_saldo = 'negativo';
  } else if (saldo_disponivel <= orcamento_mensal * 0.1) {
    status_saldo = 'alerta';
  } else {
    status_saldo = 'positivo';
  }

  // 6. Format Values for Display
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const valor_formatado = currencyFormatter.format(saldo_disponivel);

  // 7. Determine Indicator Color
  let cor_indicador: 'green' | 'red' | 'yellow' | 'gray';
  switch (status_saldo) {
    case 'positivo':
      cor_indicador = 'green';
      break;
    case 'negativo':
      cor_indicador = 'red';
      break;
    case 'alerta':
      cor_indicador = 'yellow';
      break;
    default:
      cor_indicador = 'gray';
  }

  // 8. Determine Status Message
  let mensagem_status: string;
  switch (status_saldo) {
    case 'positivo':
      mensagem_status = 'Saldo disponível';
      break;
    case 'negativo':
      mensagem_status = 'Orçamento ultrapassado';
      break;
    case 'alerta':
      mensagem_status = 'Atenção: saldo baixo';
      break;
    default:
      mensagem_status = 'Defina um orçamento mensal';
  }

  // 9. Format Percentage
  const valor_percentual_formatado =
    percentual_utilizado !== null ? `${percentual_utilizado.toFixed(1).replace('.', ',')}%` : '--';

  // 10. Calculate Progress Bar
  let progresso_barra = 0;
  if (percentual_utilizado !== null) {
    progresso_barra = percentual_utilizado / 100;
  }

  // 11. Determine Progress Bar Color
  let cor_barra_progresso: 'green' | 'red' | 'yellow' | 'gray';
  if (percentual_utilizado === null) {
    cor_barra_progresso = 'gray';
  } else if (percentual_utilizado > 100) {
    cor_barra_progresso = 'red';
  } else if (percentual_utilizado >= 90) {
    cor_barra_progresso = 'yellow';
  } else {
    cor_barra_progresso = 'green';
  }

  // 12. No Budget Container
  const container_mensagem_sem_orcamento = {
    visivel: status_saldo === 'indefinido',
    mensagem: 'Defina um orçamento mensal',
    acao: '/orcamento', // Assuming a route for budget definition
  };

  return {
    orcamento_mensal,
    total_gastos_mes,
    saldo_disponivel,
    percentual_utilizado,
    status_saldo,
    mes_referencia: new Date(currentYear, currentMonth, 1),
    valor_formatado,
    cor_indicador,
    mensagem_status,
    valor_percentual_formatado,
    progresso_barra,
    cor_barra_progresso,
    container_mensagem_sem_orcamento,
  };
}
