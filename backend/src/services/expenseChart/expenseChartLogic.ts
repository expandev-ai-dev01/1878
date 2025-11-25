/**
 * @summary
 * Expense chart business logic implementation.
 * Handles expense aggregation by category with top 10 filtering and "Others" grouping.
 *
 * @module services/expenseChart/expenseChartLogic
 */

import {
  ExpenseChartGetRequest,
  ExpenseChartResponse,
  CategoryChartData,
} from './expenseChartTypes';

/**
 * @summary
 * Retrieves expense chart data with category distribution
 *
 * @function expenseChartGet
 * @module services/expenseChart/expenseChartLogic
 *
 * @param {ExpenseChartGetRequest} params - Request parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.month] - Month in YYYY-MM format (defaults to current)
 *
 * @returns {Promise<ExpenseChartResponse>} Expense chart data with categories
 */
export async function expenseChartGet(
  params: ExpenseChartGetRequest
): Promise<ExpenseChartResponse> {
  /**
   * @rule {fn-month-calculation} Determine reference month
   */
  const referenceDate = params.month ? new Date(params.month + '-01') : new Date();
  const referenceMonth = referenceDate.getMonth() + 1;
  const referenceYear = referenceDate.getFullYear();

  /**
   * @rule {fn-expense-aggregation} Get expenses from in-memory storage
   * @remarks In production, this would call spExpenseListByMonth stored procedure
   */
  const { getExpensesByAccount } = require('../expense/expenseLogic');
  const allExpenses = await getExpensesByAccount(params.idAccount);

  /**
   * @rule {fn-month-filtering} Filter expenses for reference month
   */
  const monthExpenses = allExpenses.filter((exp: any) => {
    const expDate = new Date(exp.expenseDate);
    return (
      expDate.getMonth() + 1 === referenceMonth &&
      expDate.getFullYear() === referenceYear &&
      !exp.deleted
    );
  });

  /**
   * @rule {fn-category-aggregation} Group expenses by category
   */
  const categoryMap = new Map<
    number,
    { name: string; icon: string; color: string; amount: number }
  >();

  const { categoryList } = require('../category/categoryLogic');
  const categories = await categoryList({ idAccount: params.idAccount });

  for (const expense of monthExpenses) {
    const category = categories.find((cat: any) => cat.idCategory === expense.idCategory);
    if (!category) continue;

    const existing = categoryMap.get(expense.idCategory);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      categoryMap.set(expense.idCategory, {
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: expense.amount,
      });
    }
  }

  /**
   * @rule {fn-total-calculation} Calculate total amount
   */
  const totalAmount = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.amount, 0);

  /**
   * @rule {fn-category-sorting} Sort categories by amount descending
   */
  const sortedCategories = Array.from(categoryMap.entries())
    .map(([idCategory, data]) => ({
      idCategory,
      ...data,
    }))
    .sort((a, b) => b.amount - a.amount);

  /**
   * @rule {fn-top-10-selection} Select top 10 categories and group others
   */
  const top10Categories = sortedCategories.slice(0, 10);
  const otherCategories = sortedCategories.slice(10);

  const chartCategories: CategoryChartData[] = [];

  /**
   * @rule {fn-percentage-calculation} Calculate percentages for top 10
   */
  for (const cat of top10Categories) {
    const percentage = totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0;
    chartCategories.push({
      idCategory: cat.idCategory,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      amount: Number(cat.amount.toFixed(2)),
      percentage: Number(percentage.toFixed(1)),
      isOthers: false,
    });
  }

  /**
   * @rule {fn-others-grouping} Create "Others" category if needed
   */
  if (otherCategories.length > 0) {
    const othersAmount = otherCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const othersPercentage = totalAmount > 0 ? (othersAmount / totalAmount) * 100 : 0;

    chartCategories.push({
      idCategory: 0,
      name: 'Outros',
      icon: 'dots',
      color: '#9E9E9E',
      amount: Number(othersAmount.toFixed(2)),
      percentage: Number(othersPercentage.toFixed(1)),
      isOthers: true,
    });
  }

  /**
   * @rule {fn-percentage-adjustment} Ensure percentages sum to exactly 100%
   */
  if (chartCategories.length > 0 && totalAmount > 0) {
    const percentageSum = chartCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    const difference = 100 - percentageSum;

    if (Math.abs(difference) > 0.01) {
      chartCategories[0].percentage = Number(
        (chartCategories[0].percentage + difference).toFixed(1)
      );
    }
  }

  /**
   * @rule {fn-period-formatting} Format period reference
   */
  const period = `${String(referenceMonth).padStart(2, '0')}/${referenceYear}`;

  return {
    period,
    totalAmount: Number(totalAmount.toFixed(2)),
    categories: chartCategories,
    timestamp: new Date().toISOString(),
  };
}
