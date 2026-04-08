export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
};

function createDateFromToday(offsetInDays: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetInDays);
  return date;
}

export const EXPENSES: Expense[] = [
  {
    id: 'e1',
    description: 'Mercado',
    amount: 89.9,
    date: createDateFromToday(-1),
  },
  {
    id: 'e2',
    description: 'Internet',
    amount: 119.9,
    date: createDateFromToday(-3),
  },
  {
    id: 'e3',
    description: 'Farmacia',
    amount: 42.5,
    date: createDateFromToday(-5),
  },
  {
    id: 'e4',
    description: 'Cinema',
    amount: 36,
    date: createDateFromToday(-8),
  },
  {
    id: 'e5',
    description: 'Academia',
    amount: 75,
    date: createDateFromToday(-12),
  },
  {
    id: 'e6',
    description: 'Compra futura',
    amount: 150,
    date: createDateFromToday(2),
  },
];
