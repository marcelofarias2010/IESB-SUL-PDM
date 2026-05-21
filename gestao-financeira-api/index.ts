import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, name: "gestao-financeira-api" });
});

app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.post('/categories', async (req, res) => {
  const { name, displayName, icon, background, isIncome } = req.body;
  const category = await prisma.category.create({
    data: { name, displayName, icon, background, isIncome, isDefault: false }
  });
  res.status(201).json(category);
});

app.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { displayName } = req.body;
  const category = await prisma.category.update({
    where: { id },
    data: { displayName }
  });
  res.json(category);
});

app.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (category?.isDefault) {
    return res.status(400).json({ message: "Categorias padrão não podem ser excluídas" });
  }
  await prisma.category.delete({ where: { id } });
  res.status(204).send();
});

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number(),
  date: z.string(),
  categoryId: z.string()
});

app.post('/transactions', async (req, res) => {
  try {
    transactionSchema.parse(req.body);
    const { description, value, date, categoryId } = req.body;
    const transaction = await prisma.transaction.create({
      data: { description, value, date: new Date(date), categoryId },
      include: { category: true }
    });
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: "Dados inválidos", details: error.errors });
  }
});

app.get('/transactions', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: { category: true }
  });
  res.json(transactions);
});

app.delete('/transactions/:id', async (req, res) => {
  await prisma.transaction.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on 3000'));