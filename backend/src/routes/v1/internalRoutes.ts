/**
 * @summary
 * Internal API routes configuration for authenticated endpoints.
 * Handles all authenticated user operations and protected resources.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as expenseController from '@/api/v1/internal/expense/controller';
import * as categoryController from '@/api/v1/internal/category/controller';

const router = Router();

/**
 * @rule {be-expense-routes} Expense management routes
 */
router.post('/expense', expenseController.postHandler);

/**
 * @rule {be-category-routes} Category management routes
 */
router.get('/category', categoryController.getHandler);

export default router;
