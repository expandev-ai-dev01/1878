/**
 * @summary
 * Monthly total business logic implementation.
 * Calculates monthly expense totals with comparisons and budget indicators.
 *
 * @module services/monthlyTotal/monthlyTotalLogic
 */

import { MonthlyTotalGetRequest, MonthlyTotalResponse } from './monthlyTotalTypes';

/**
 * @summary
 * Retrieves monthly total expenses with comparison and budget analysis
 *
 * @function monthlyTotalGet
 * @module services/monthlyTotal/monthlyTotalLogic
 *
 * @param {MonthlyTotalGetRequest} params - Request parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.month] - Month in YYYY-MM format (defaults to current)
 *
 * @returns {Promise<MonthlyTotalResponse>} Monthly total data with comparisons
 */
export async function monthlyTotalGet(
  params: MonthlyTotalGetRequest
): Promise<MonthlyTotalResponse> {
  /**
   * @rule {fn-month-calculation} Determine reference month and previous month
   */
  const referenceDate = params.month ? new Date(params.month + '-01') : new Date();
  const referenceMonth = referenceDate.getMonth();
  const referenceYear = referenceDate.getFullYear();

  const previousDate = new Date(referenceYear, referenceMonth - 1, 1);
  const previousMonth = previousDate.getMonth();
  const previousYear = previousDate.getFullYear();

  /**
   * @rule {fn-expense-aggregation} Get expenses from in-memory storage
   * @remarks In production, this would query the database
   */
  const { getExpensesByAccount } = require('../expense/expenseLogic');
  const allExpenses = await getExpensesByAccount(params.idAccount);

  /**
   * @rule {fn-current-month-total} Calculate current month total
   */
  const currentMonthExpenses = allExpenses.filter((exp: any) => {
    const expDate = new Date(exp.expenseDate);
    return (
      expDate.getMonth() === referenceMonth &&
      expDate.getFullYear() === referenceYear &&
      !exp.deleted
    );
  });

  const totalCurrentMonth = currentMonthExpenses.reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0
  );

  /**
   * @rule {fn-previous-month-total} Calculate previous month total
   */
  const previousMonthExpenses = allExpenses.filter((exp: any) => {
    const expDate = new Date(exp.expenseDate);
    return (
      expDate.getMonth() === previousMonth && expDate.getFullYear() === previousYear && !exp.deleted
    );
  });

  const totalPreviousMonth = previousMonthExpenses.reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0
  );

  /**
   * @rule {fn-percentage-variation} Calculate percentage variation
   */
  let percentageVariation: number | null = null;
  let percentageVariationDisplay: string;

  if (totalPreviousMonth === 0 && totalCurrentMonth === 0) {
    percentageVariationDisplay = 'Sem dados para comparação';
  } else if (totalPreviousMonth === 0) {
    percentageVariationDisplay = 'Sem dados para comparação';
  } else {
    percentageVariation = ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
    percentageVariationDisplay = percentageVariation.toFixed(1) + '%';
  }

  /**
   * @rule {fn-budget-retrieval} Get monthly budget (mock implementation)
   * @remarks In production, this would query budget from database
   */
  const monthlyBudget: number | null = null;

  /**
   * @rule {fn-visual-indicator} Determine visual indicator based on budget
   */
  let visualIndicator: string;
  let budgetPercentage: number | null = null;
  let budgetPercentageDisplay: string;

  if (monthlyBudget === null) {
    visualIndicator = 'gray';
    budgetPercentageDisplay = 'Orçamento não definido';
  } else {
    budgetPercentage = (totalCurrentMonth / monthlyBudget) * 100;
    budgetPercentageDisplay = budgetPercentage.toFixed(1) + '%';

    if (budgetPercentage <= 80) {
      visualIndicator = 'green';
    } else if (budgetPercentage <= 100) {
      visualIndicator = 'yellow';
    } else {
      visualIndicator = 'red';
    }
  }

  /**
   * @rule {fn-month-formatting} Format month reference for display
   */
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const monthReference = `${String(referenceMonth + 1).padStart(2, '0')}/${referenceYear}`;
  const monthReferenceDisplay = `${monthNames[referenceMonth]}/${referenceYear}`;

  return {
    monthReference,
    monthReferenceDisplay,
    totalCurrentMonth: Number(totalCurrentMonth.toFixed(2)),
    totalPreviousMonth: Number(totalPreviousMonth.toFixed(2)),
    percentageVariation,
    percentageVariationDisplay,
    visualIndicator,
    budgetPercentage,
    budgetPercentageDisplay,
    budgetAmount: monthlyBudget,
  };
}
