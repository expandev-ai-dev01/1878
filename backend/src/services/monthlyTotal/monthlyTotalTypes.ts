/**
 * @summary
 * Type definitions for monthly total service operations.
 * Defines interfaces for monthly total request and response structures.
 *
 * @module services/monthlyTotal/monthlyTotalTypes
 */

/**
 * @interface MonthlyTotalGetRequest
 * @description Request parameters for retrieving monthly total
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [month] - Optional month in YYYY-MM format (defaults to current)
 */
export interface MonthlyTotalGetRequest {
  idAccount: number;
  month?: string;
}

/**
 * @interface MonthlyTotalResponse
 * @description Response structure for monthly total data
 *
 * @property {string} monthReference - Reference month in MM/YYYY format
 * @property {string} monthReferenceDisplay - Reference month display name (e.g., "Janeiro/2024")
 * @property {number} totalCurrentMonth - Total expenses for reference month
 * @property {number} totalPreviousMonth - Total expenses for previous month
 * @property {number | null} percentageVariation - Percentage variation between months
 * @property {string} percentageVariationDisplay - Formatted percentage or message
 * @property {string} visualIndicator - Color indicator (green/yellow/red/gray)
 * @property {number | null} budgetPercentage - Percentage of budget used
 * @property {string} budgetPercentageDisplay - Formatted budget percentage or message
 * @property {number | null} budgetAmount - Monthly budget amount if defined
 */
export interface MonthlyTotalResponse {
  monthReference: string;
  monthReferenceDisplay: string;
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  percentageVariation: number | null;
  percentageVariationDisplay: string;
  visualIndicator: string;
  budgetPercentage: number | null;
  budgetPercentageDisplay: string;
  budgetAmount: number | null;
}
