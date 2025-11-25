/**
 * @summary
 * Expense management controller handling expense creation operations.
 * Validates input data and coordinates with expense service layer.
 *
 * @module api/v1/internal/expense/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { expenseCreate } from '@/services/expense';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/expense Create Expense
 * @apiName CreateExpense
 * @apiGroup Expense
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new expense record with amount, date, category and optional description
 *
 * @apiParam {Number} amount Expense amount (must be positive)
 * @apiParam {String} expenseDate Expense date (ISO format)
 * @apiParam {String} [description] Optional expense description (max 100 characters)
 * @apiParam {Number} idCategory Category identifier
 *
 * @apiSuccess {Number} idExpense Created expense identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Request body schema validation
   */
  const bodySchema = z.object({
    amount: z.number().positive(),
    expenseDate: z.string().datetime(),
    description: z.string().max(100).nullable().optional(),
    idCategory: z.number().int().positive(),
  });

  try {
    /**
     * @rule {be-input-validation} Validate request body
     */
    const validatedData = bodySchema.parse(req.body);

    /**
     * @rule {be-user-context} Extract user context from request
     * @remarks In production, this would come from authentication middleware
     */
    const idAccount = 1;
    const idUser = 1;

    /**
     * @rule {fn-expense-create} Create expense through service layer
     */
    const result = await expenseCreate({
      idAccount,
      idUser,
      amount: validatedData.amount,
      expenseDate: new Date(validatedData.expenseDate),
      description: validatedData.description || null,
      idCategory: validatedData.idCategory,
    });

    res.status(201).json(successResponse(result));
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
