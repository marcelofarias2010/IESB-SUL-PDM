import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  displayName: z.string().min(1, 'Nome de exibição é obrigatório'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  background: z.string().min(1, 'Cor de fundo é obrigatória'),
  isIncome: z.boolean().default(false),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  displayName: z.string().min(1, 'Nome de exibição é obrigatório').optional(),
  icon: z.string().min(1, 'Ícone é obrigatório').optional(),
  background: z.string().min(1, 'Cor de fundo é obrigatória').optional(),
  isIncome: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
