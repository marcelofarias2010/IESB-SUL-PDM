import { PrismaClient } from '../generated/client/index.js';

/**
 * Instância única do PrismaClient compartilhada por toda a aplicação.
 * Criar várias instâncias abre conexões demais com o banco.
 */
export const prisma = new PrismaClient();