/**
 * @summary
 * Available balance controller handling balance visualization.
 * Provides endpoint for retrieving calculated available balance and status indicators.
 *
 * @module api/v1/internal/available-balance/controller
 */

import { Request, Response, NextFunction } from 'express';
import { availableBalanceGet } from '@/services/availableBalance';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {get} /api/v1/internal/available-balance Get Available Balance
 * @apiName GetAvailableBalance
 * @apiGroup AvailableBalance
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the remaining available balance for the current month based on budget and expenses
 *
 * @apiSuccess {Number} orcamento_mensal Defined monthly budget
 * @apiSuccess {Number} total_gastos_mes Total expenses for current month
 * @apiSuccess {Number} saldo_disponivel Calculated available balance
 * @apiSuccess {Number} percentual_utilizado Percentage of budget used
 * @apiSuccess {String} status_saldo Status code (positivo, negativo, alerta, indefinido)
 * @apiSuccess {Date} mes_referencia Reference month date
 * @apiSuccess {String} valor_formatado Formatted balance string (R$)
 * @apiSuccess {String} cor_indicador Color indicator (green, red, yellow, gray)
 * @apiSuccess {String} mensagem_status Human readable status message
 * @apiSuccess {String} valor_percentual_formatado Formatted percentage string
 * @apiSuccess {Number} progresso_barra Progress bar value (0-1+)
 * @apiSuccess {String} cor_barra_progresso Progress bar color
 * @apiSuccess {Object} container_mensagem_sem_orcamento No budget warning container config
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
     * @rule {fn-available-balance-get} Get available balance through service layer
     */
    const result = await availableBalanceGet({
      idAccount,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    /**
     * @rule {be-error-handling} Handle business errors
     */
    if (error.message) {
      res.status(400).json(errorResponse(error.message, 'BUSINESS_ERROR'));
    } else {
      next(error);
    }
  }
}
