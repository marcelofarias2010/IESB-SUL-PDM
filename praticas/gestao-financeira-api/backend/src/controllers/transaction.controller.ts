import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.validator';

const prisma = new PrismaClient();

export async function getTransactions(req: Request, res: Response): Promise<void> {
  try {
    const { month, year } = req.query;

    let dateFilter = {};

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (year) {
      const startDate = new Date(Number(year), 0, 1);
      const endDate = new Date(Number(year), 11, 31, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: dateFilter,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createTransaction(req: Request, res: Response): Promise<void> {
  const parseResult = createTransactionSchema.safeParse(req.body);

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
    const category = await prisma.category.findUnique({
      where: { id: parseResult.data.categoryId },
    });

    if (!category) {
      res.status(404).json({ error: 'Categoria não encontrada' });
      return;
    }

    const transaction = await prisma.transaction.create({
      data: {
        description: parseResult.data.description,
        value: parseResult.data.value,
        date: new Date(parseResult.data.date),
        categoryId: parseResult.data.categoryId,
      },
      include: { category: true },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateTransaction(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parseResult = updateTransactionSchema.safeParse(req.body);

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
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Transação não encontrada' });
      return;
    }

    if (parseResult.data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseResult.data.categoryId },
      });
      if (!category) {
        res.status(404).json({ error: 'Categoria não encontrada' });
        return;
      }
    }

    const updateData: {
      description?: string;
      value?: number;
      date?: Date;
      categoryId?: string;
    } = {};

    if (parseResult.data.description) updateData.description = parseResult.data.description;
    if (parseResult.data.value) updateData.value = parseResult.data.value;
    if (parseResult.data.date) updateData.date = new Date(parseResult.data.date);
    if (parseResult.data.categoryId) updateData.categoryId = parseResult.data.categoryId;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteTransaction(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Transação não encontrada' });
      return;
    }

    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
