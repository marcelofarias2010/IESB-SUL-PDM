import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'income', displayName: 'Receita', icon: 'attach-money', background: '#D4EDDA', isIncome: true, isDefault: true },
      { name: 'food', displayName: 'Alimentação', icon: 'restaurant', background: '#FFF3CD', isIncome: false, isDefault: true },
      { name: 'transport', displayName: 'Transporte', icon: 'directions-car', background: '#CCE5FF', isIncome: false, isDefault: true },
      { name: 'housing', displayName: 'Moradia', icon: 'home', background: '#E2E3E5', isIncome: false, isDefault: true },
      { name: 'entertainment', displayName: 'Lazer', icon: 'movie', background: '#D1ECF1', isIncome: false, isDefault: true },
    ]
  })
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())