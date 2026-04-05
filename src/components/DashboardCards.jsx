// src/components/DashboardCards.jsx
import React, { useMemo } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react'; 
import { formatCurrency } from '../utils/formatCurrency';

const DashboardCards = ({ transactions = [] }) => {
  // --- DATA COMPUTATION ---
  const { income, expense, balance, maxExpense, count, avgTransaction } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let maxExpense = 0;

    transactions.forEach((curr) => {
      if (curr.type === 'income') {
        income += curr.amount;
      }
      
      if (curr.type === 'expense') {
        expense += curr.amount;
        if (curr.amount > maxExpense) {
          maxExpense = curr.amount;
        }
      }
    });

    const balance = income - expense;
    const count = transactions.length;
    const avgTransaction = count > 0 ? (income + expense) / count : 0;

    return { income, expense, balance, maxExpense, count, avgTransaction };
  }, [transactions]);

  // --- UI RENDERING ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      
      {/* 1. Total Balance Card */}
      <div className="bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-xl text-primary dark:text-blue-400">
            <IndianRupee size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Total Balance
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(balance)}
            </h3>
          </div>
        </div>
        
        <div className="mt-4 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
          <span>{count} Transactions</span>
          <span>Avg: {formatCurrency(avgTransaction)}</span>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 md:p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Total Income
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(income)}
            </h3>
          </div>
        </div>
        
        <div className="mt-4 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-1 text-[11px] md:text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>+12% this month</span>
        </div>
      </div>

      {/* 3. Total Expenses Card */}
      <div className="bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-2 md:p-3 rounded-xl text-rose-600 dark:text-rose-400">
            <TrendingDown size={24} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Total Expenses
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(expense)}
            </h3>
          </div>
        </div>
        
        <div className="mt-4 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] md:text-xs">
          <div className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
             <ArrowDownRight size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />
             <span>-5% from last month</span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Max: {formatCurrency(maxExpense)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default DashboardCards;