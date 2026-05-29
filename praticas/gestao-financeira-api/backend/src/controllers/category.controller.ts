import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const prisma = new PrismaClient();

export async function getCategories(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const parseResult = createCategorySchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: parseResult.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { name: parseResult.data.name },
    });

    if (existing) {
      res.status(409).json({ error: 'Já existe uma categoria com este nome' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        ...parseResult.data,
        isDefault: false,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parseResult = updateCategorySchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: parseResult.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  try {
    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Categoria não encontrada' });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: parseResult.data,
    });
    res.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      res.status(404).json({ error: 'Categoria não encontrada' });
      return;
    }

    if (category.isDefault) {
      res.status(400).json({ error: 'Categorias padrão não podem ser excluídas' });
      return;
    }

    const transactionsCount = await prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionsCount > 0) {
      res.status(400).json({
        error: 'Não é possível excluir categoria com transações associadas',
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
