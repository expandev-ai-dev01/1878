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
import * as monthlyTotalController from '@/api/v1/internal/monthly-total/controller';
import * as expenseChartController from '@/api/v1/internal/expense-chart/controller';

const router = Router();

router.post('/expense', expenseController.postHandler);

router.get('/category', categoryController.getHandler);
router.post('/category', categoryController.postHandler);
router.get('/category/:id', categoryController.getDetailHandler);
router.put('/category/:id', categoryController.putHandler);
router.delete('/category/:id', categoryController.deleteHandler);
router.post('/category/:id/restore', categoryController.restoreHandler);

router.get('/monthly-total', monthlyTotalController.getHandler);

router.get('/expense-chart', expenseChartController.getHandler);

export default router;
