import { z } from 'zod';

export const createTransactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().positive('Valor deve ser positivo'),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().uuid('ID de categoria inválido'),
});

export const updateTransactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').optional(),
  value: z.number().positive('Valor deve ser positivo').optional(),
  date: z.string().min(1, 'Data é obrigatória').optional(),
  categoryId: z.string().uuid('ID de categoria inválido').optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
