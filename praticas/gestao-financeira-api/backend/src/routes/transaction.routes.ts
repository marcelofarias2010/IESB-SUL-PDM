import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const transactionRoutes = Router();

transactionRoutes.use(authMiddleware);

transactionRoutes.get('/', getTransactions);
transactionRoutes.post('/', createTransaction);
transactionRoutes.put('/:id', updateTransaction);
transactionRoutes.delete('/:id', deleteTransaction);
