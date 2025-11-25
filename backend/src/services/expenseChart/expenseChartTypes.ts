/**
 * @summary
 * Type definitions for expense chart service operations.
 * Defines interfaces for expense chart request and response structures.
 *
 * @module services/expenseChart/expenseChartTypes
 */

/**
 * @interface ExpenseChartGetRequest
 * @description Request parameters for retrieving expense chart data
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [month] - Optional month in YYYY-MM format (defaults to current)
 */
export interface ExpenseChartGetRequest {
  idAccount: number;
  month?: string;
}

/**
 * @interface CategoryChartData
 * @description Category data for chart visualization
 *
 * @property {number} idCategory - Category identifier (0 for "Others")
 * @property {string} name - Category name
 * @property {string} icon - Category icon identifier
 * @property {string} color - Category color code
 * @property {number} amount - Total amount for category
 * @property {number} percentage - Percentage of total (sum to 100%)
 * @property {boolean} isOthers - Whether this is the "Others" grouping
 */
export interface CategoryChartData {
  idCategory: number;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  isOthers: boolean;
}

/**
 * @interface ExpenseChartResponse
 * @description Response structure for expense chart data
 *
 * @property {string} period - Period reference in MM/YYYY format
 * @property {number} totalAmount - Total expenses for the period
 * @property {CategoryChartData[]} categories - List of category data (max 11: top 10 + Others)
 * @property {string} timestamp - ISO timestamp of data generation
 */
export interface ExpenseChartResponse {
  period: string;
  totalAmount: number;
  categories: CategoryChartData[];
  timestamp: string;
}
