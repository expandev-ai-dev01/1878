/**
 * @summary
 * Expense chart controller handling category-based expense visualization.
 * Provides endpoint for retrieving expense distribution data for chart generation.
 *
 * @module api/v1/internal/expense-chart/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { expenseChartGet } from '@/services/expenseChart';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/expense-chart Get Expense Chart Data
 * @apiName GetExpenseChart
 * @apiGroup ExpenseChart
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves expense distribution by category for chart visualization
 *
 * @apiParam {String} [month] Month in YYYY-MM format (defaults to current month)
 *
 * @apiSuccess {String} period Period reference (MM/YYYY format)
 * @apiSuccess {Number} totalAmount Total expenses for the period
 * @apiSuccess {Array} categories List of category expense data
 * @apiSuccess {Number} categories.idCategory Category identifier
 * @apiSuccess {String} categories.name Category name
 * @apiSuccess {String} categories.icon Category icon identifier
 * @apiSuccess {String} categories.color Category color code
 * @apiSuccess {Number} categories.amount Total amount for category
 * @apiSuccess {Number} categories.percentage Percentage of total
 * @apiSuccess {Boolean} categories.isOthers Whether this is the "Others" grouping
 * @apiSuccess {String} timestamp Last update timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Query parameter schema validation
   */
  const querySchema = z.object({
    month: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
  });

  try {
    /**
     * @rule {be-input-validation} Validate query parameters
     */
    const validatedQuery = querySchema.parse(req.query);

    /**
     * @rule {be-user-context} Extract user context from request
     * @remarks In production, this would come from authentication middleware
     */
    const idAccount = 1;

    /**
     * @rule {fn-expense-chart-get} Get expense chart data through service layer
     */
    const result = await expenseChartGet({
      idAccount,
      month: validatedQuery.month,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    /**
     * @rule {be-error-handling} Handle validation and business errors
     */
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}
