/**
 * @summary
 * Category management controller handling category listing operations.
 * Provides category data for expense classification.
 *
 * @module api/v1/internal/category/controller
 */

import { Request, Response, NextFunction } from 'express';
import { categoryList } from '@/services/category';
import { successResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/category List Categories
 * @apiName ListCategories
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all active categories ordered alphabetically
 *
 * @apiSuccess {Array} categories List of category objects
 * @apiSuccess {Number} categories.idCategory Category identifier
 * @apiSuccess {String} categories.name Category name
 *
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @rule {be-user-context} Extract user context from request
     * @remarks In production, this would come from authentication middleware
     */
    const idAccount = 1;

    /**
     * @rule {fn-category-list} Retrieve categories through service layer
     */
    const categories = await categoryList({ idAccount });

    res.json(successResponse(categories));
  } catch (error: any) {
    next(error);
  }
}
