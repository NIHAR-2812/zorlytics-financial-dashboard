// src/data/mockData.js

export const initialTransactions = [
  // MAY 2026
  { id: '40', date: '2026-05-10', amount: 200, category: 'Dining', type: 'expense' },
  { id: '39', date: '2026-05-08', amount: 90, category: 'Groceries', type: 'expense' },
  { id: '38', date: '2026-05-05', amount: 110, category: 'Utilities', type: 'expense' },
  { id: '37', date: '2026-05-03', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '36', date: '2026-05-01', amount: 3200, category: 'Salary', type: 'income' },

  // APRIL 2026
  { id: '35', date: '2026-04-29', amount: 500, category: 'Bonus', type: 'income' },
  { id: '34', date: '2026-04-27', amount: 95, category: 'Groceries', type: 'expense' },
  { id: '33', date: '2026-04-25', amount: 65, category: 'Dining', type: 'expense' },
  { id: '32', date: '2026-04-23', amount: 300, category: 'Freelance', type: 'income' },
  { id: '31', date: '2026-04-20', amount: 180, category: 'Health', type: 'expense' },
  { id: '30', date: '2026-04-18', amount: 40, category: 'Transport', type: 'expense' },
  { id: '29', date: '2026-04-16', amount: 800, category: 'Dividends', type: 'income' },
  { id: '28', date: '2026-04-14', amount: 250, category: 'Shopping', type: 'expense' },
  { id: '27', date: '2026-04-12', amount: 20, category: 'Coffee', type: 'expense' },
  { id: '26', date: '2026-04-10', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '25', date: '2026-04-08', amount: 1500, category: 'Freelance', type: 'income' },
  { id: '24', date: '2026-04-05', amount: 60, category: 'Transport', type: 'expense' },
  { id: '23', date: '2026-04-02', amount: 3200, category: 'Salary', type: 'income' },

  // MARCH 2026
  { id: '22', date: '2026-03-30', amount: 50, category: 'Subscriptions', type: 'expense' },
  { id: '21', date: '2026-03-28', amount: 120, category: 'Internet', type: 'expense' },
  { id: '20', date: '2026-03-25', amount: 200, category: 'Dining', type: 'expense' },
  { id: '19', date: '2026-03-22', amount: 1000, category: 'Freelance', type: 'income' },
  { id: '18', date: '2026-03-20', amount: 75, category: 'Groceries', type: 'expense' },
  { id: '17', date: '2026-03-18', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '16', date: '2026-03-15', amount: 3200, category: 'Salary', type: 'income' },

  // FEBRUARY 2026
  { id: '15', date: '2026-02-28', amount: 60, category: 'Transport', type: 'expense' },
  { id: '14', date: '2026-02-26', amount: 150, category: 'Shopping', type: 'expense' },
  { id: '13', date: '2026-02-24', amount: 90, category: 'Groceries', type: 'expense' },
  { id: '12', date: '2026-02-20', amount: 800, category: 'Bonus', type: 'income' },
  { id: '11', date: '2026-02-18', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '10', date: '2026-02-15', amount: 3200, category: 'Salary', type: 'income' },

  // JANUARY 2026
  { id: '9', date: '2026-01-28', amount: 100, category: 'Entertainment', type: 'expense' },
  { id: '8', date: '2026-01-25', amount: 200, category: 'Dining', type: 'expense' },
  { id: '7', date: '2026-01-22', amount: 70, category: 'Groceries', type: 'expense' },
  { id: '6', date: '2026-01-20', amount: 500, category: 'Freelance', type: 'income' },
  { id: '5', date: '2026-01-18', amount: 1200, category: 'Rent', type: 'expense' },
  { id: '4', date: '2026-01-15', amount: 3200, category: 'Salary', type: 'income' },

  // DECEMBER 2025
  { id: '3', date: '2025-12-28', amount: 150, category: 'Shopping', type: 'expense' },
  { id: '2', date: '2025-12-25', amount: 1000, category: 'Bonus', type: 'income' },
  { id: '1', date: '2025-12-20', amount: 1200, category: 'Rent', type: 'expense' },
];

export const calculateSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.type === "income") {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  };
};