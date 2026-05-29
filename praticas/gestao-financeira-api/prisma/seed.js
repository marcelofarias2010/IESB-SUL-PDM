import { PrismaClient } from '../src/generated/client/index.js';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "income",    displayName: "Renda",       icon: "work",                background: "#FF9800", isIncome: true,  isDefault: true }, // 🍊 Laranja
  { name: "food",      displayName: "Alimentação", icon: "fastfood",            background: "#4CAF50", isIncome: false, isDefault: true }, // 🍏 Verde
  { name: "house",     displayName: "Casa",        icon: "home",                background: "#E6E088", isIncome: false, isDefault: true }, // 💛 Amarelo
  { name: "education", displayName: "Educação",    icon: "book",                background: "#9E9E9E", isIncome: false, isDefault: true }, // 🩶 Cinza
  { name: "travel",    displayName: "Viagens",     icon: "airplanemode-active", background: "#2196F3", isIncome: false, isDefault: true }, // 🔹 Azul
  { name: "health",    displayName: "Saúde",       icon: "local-hospital",      background: "#F44336", isIncome: false, isDefault: true }, // 🛑 Vermelho
];


async function main() {
  for (const c of defaultCategories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }
  console.log("Seed concluído.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());