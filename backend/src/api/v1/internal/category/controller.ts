/**
 * @summary
 * Category management controller handling all category operations.
 * Provides CRUD operations for both predefined and custom categories.
 *
 * @module api/v1/internal/category/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  categoryList,
  categoryCreate,
  categoryGet,
  categoryUpdate,
  categoryDelete,
  categoryRestore,
} from '@/services/category';
import { successResponse, errorResponse } from '@/utils/response';

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
 * @apiSuccess {String} categories.icon Icon identifier
 * @apiSuccess {String} categories.color Hexadecimal color code
 * @apiSuccess {String} categories.type Category type (predefined or custom)
 * @apiSuccess {Boolean} categories.edited Whether predefined category has been edited
 *
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const idAccount = 1;
    const categories = await categoryList({ idAccount });
    res.json(successResponse(categories));
  } catch (error: any) {
    next(error);
  }
}

/**
 * @api {post} /api/v1/internal/category Create Category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new custom category with name, icon, and color
 *
 * @apiParam {String} name Category name (3-30 characters)
 * @apiParam {String} icon Icon identifier
 * @apiParam {String} color Hexadecimal color code
 *
 * @apiSuccess {Number} idCategory Created category identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const bodySchema = z.object({
    name: z.string().min(3).max(30),
    icon: z.string().min(1).max(50),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  });

  try {
    const validatedData = bodySchema.parse(req.body);
    const idAccount = 1;
    const idUser = 1;

    const result = await categoryCreate({
      idAccount,
      idUser,
      name: validatedData.name,
      icon: validatedData.icon,
      color: validatedData.color,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /api/v1/internal/category/:id Get Category
 * @apiName GetCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific category
 *
 * @apiParam {Number} id Category identifier
 *
 * @apiSuccess {Number} idCategory Category identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} icon Icon identifier
 * @apiSuccess {String} color Hexadecimal color code
 * @apiSuccess {String} type Category type
 * @apiSuccess {Boolean} edited Whether category has been edited
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} NotFoundError Category not found
 * @apiError {String} ServerError Internal server error
 */
export async function getDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const idAccount = 1;

    const category = await categoryGet({
      idAccount,
      idCategory: validatedParams.id,
    });

    res.json(successResponse(category));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'categoryDoesntExist') {
      res.status(404).json(errorResponse(error.message, 'NOT_FOUND'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {put} /api/v1/internal/category/:id Update Category
 * @apiName UpdateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing category (predefined or custom)
 *
 * @apiParam {Number} id Category identifier
 * @apiParam {String} name New category name
 * @apiParam {String} icon New icon identifier
 * @apiParam {String} color New hexadecimal color code
 *
 * @apiSuccess {Number} idCategory Updated category identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    name: z.string().min(3).max(30),
    icon: z.string().min(1).max(50),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const validatedData = bodySchema.parse(req.body);
    const idAccount = 1;

    const result = await categoryUpdate({
      idAccount,
      idCategory: validatedParams.id,
      name: validatedData.name,
      icon: validatedData.icon,
      color: validatedData.color,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/category/:id Delete Category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a custom category and reassigns expenses if needed
 *
 * @apiParam {Number} id Category identifier
 * @apiParam {Number} [idSubstituteCategory] Substitute category for expenses
 *
 * @apiSuccess {Number} idCategory Deleted category identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const bodySchema = z.object({
    idSubstituteCategory: z.number().int().positive().optional(),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const validatedData = bodySchema.parse(req.body);
    const idAccount = 1;

    const result = await categoryDelete({
      idAccount,
      idCategory: validatedParams.id,
      idSubstituteCategory: validatedData.idSubstituteCategory,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}

/**
 * @api {post} /api/v1/internal/category/:id/restore Restore Category
 * @apiName RestoreCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Restores a predefined category to its original values
 *
 * @apiParam {Number} id Category identifier
 *
 * @apiSuccess {Number} idCategory Restored category identifier
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function restoreHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const idAccount = 1;

    const result = await categoryRestore({
      idAccount,
      idCategory: validatedParams.id,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}
