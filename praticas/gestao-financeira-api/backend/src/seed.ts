import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Create default user
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: hashedPassword,
    },
  });
  console.log(`✅ Usuário criado: ${user.email}`);

  // Create default categories
  const categories = [
    {
      name: 'receita',
      displayName: 'Receita',
      icon: 'cash',
      background: '#4CAF50',
      isIncome: true,
      isDefault: true,
    },
    {
      name: 'alimentacao',
      displayName: 'Alimentação',
      icon: 'food',
      background: '#FF5722',
      isIncome: false,
      isDefault: true,
    },
    {
      name: 'transporte',
      displayName: 'Transporte',
      icon: 'car',
      background: '#2196F3',
      isIncome: false,
      isDefault: true,
    },
    {
      name: 'moradia',
      displayName: 'Moradia',
      icon: 'home',
      background: '#9C27B0',
      isIncome: false,
      isDefault: true,
    },
    {
      name: 'lazer',
      displayName: 'Lazer',
      icon: 'gamepad-variant',
      background: '#FF9800',
      isIncome: false,
      isDefault: true,
    },
  ];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    console.log(`✅ Categoria criada: ${category.displayName}`);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
