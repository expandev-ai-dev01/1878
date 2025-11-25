import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z
    .number('O valor do gasto é obrigatório')
    .positive('O valor do gasto deve ser maior que zero')
    .refine((val) => {
      const decimalPlaces = (val.toString().split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }, 'O valor deve ter no máximo duas casas decimais'),
  expenseDate: z.string('A data do gasto é obrigatória').datetime('Formato de data inválido'),
  description: z
    .string()
    .max(100, 'A descrição não pode ultrapassar 100 caracteres')
    .nullable()
    .optional(),
  idCategory: z.number('É necessário selecionar uma categoria para o gasto').int().positive(),
});
