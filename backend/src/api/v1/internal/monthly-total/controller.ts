/**
 * @summary
 * Monthly total expense controller handling monthly expense calculations.
 * Provides endpoint for retrieving total expenses with comparisons and budget indicators.
 *
 * @module api/v1/internal/monthly-total/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { monthlyTotalGet } from '@/services/monthlyTotal';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/monthly-total Get Monthly Total
 * @apiName GetMonthlyTotal
 * @apiGroup MonthlyTotal
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves total expenses for current month with comparison to previous month
 * and budget indicators
 *
 * @apiParam {String} [month] Month in YYYY-MM format (defaults to current month)
 *
 * @apiSuccess {String} monthReference Reference month (MM/YYYY format)
 * @apiSuccess {Number} totalCurrentMonth Total expenses for reference month
 * @apiSuccess {Number} totalPreviousMonth Total expenses for previous month
 * @apiSuccess {Number} percentageVariation Percentage change between months
 * @apiSuccess {String} visualIndicator Color indicator based on budget (green/yellow/red/gray)
 * @apiSuccess {Number} budgetPercentage Percentage of budget used
 * @apiSuccess {Number} budgetAmount Monthly budget amount (if defined)
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
     * @rule {fn-monthly-total-get} Get monthly total through service layer
     */
    const result = await monthlyTotalGet({
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
