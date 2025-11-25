import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string('O nome da categoria é obrigatório')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(30, 'O nome deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9\s\-]+$/, 'O nome contém caracteres não permitidos'),
  icon: z.string('Selecione um ícone para a categoria').min(1),
  color: z
    .string('Selecione uma cor para a categoria')
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Código de cor inválido'),
});
