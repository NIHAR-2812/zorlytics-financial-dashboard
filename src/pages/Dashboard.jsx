// src/pages/Dashboard.jsx
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext';
import DashboardCards from '../components/DashboardCards';
import Charts from '../components/Charts';
import { Clock, Star, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const Dashboard = () => {
  const { transactions } = useContext(AppContext);
  const [timeFilter, setTimeFilter] = useState('this-month');

  // Filter transactions based on the selected time period
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;

    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case 'this-month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3-months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6-months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      default:
        break;
    }

    return transactions.filter((t) => new Date(t.date) >= cutoffDate);
  }, [transactions, timeFilter]);

  // Get the 4 most recent transactions
  const recentActivity = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
  }, [filteredTransactions]);

  // Calculate the top 3 spending categories
  const topCategories = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === 'expense');
    
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [filteredTransactions]);

  // Pre-calculate max amount for the categories bar chart to avoid recalculating in loop
  const maxCategoryAmount = topCategories.length > 0 ? topCategories[0].amount : 0;

  return (
    <div className="space-y-6 pb-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            Financial Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your spending patterns over time.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full sm:w-auto">
          <div className="pl-3 text-slate-400">
            <Calendar size={18} />
          </div>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white cursor-pointer"
          >
            <option value="this-month">This Month</option>
            <option value="3-months">Last 3 Months</option>
            <option value="6-months">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Main Metric Cards & Charts */}
      <DashboardCards transactions={filteredTransactions} />
      <Charts transactions={filteredTransactions} />

      {/* Smart Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Widget 1: Recent Activity Feed */}
        <div className="bg-surface dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Recent Activity
            </h3>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {recentActivity.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[150px]">
                No recent activity in this period.
              </div>
            ) : (
              recentActivity.map((item) => {
                const isIncome = item.type === 'income';
                
                return (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className={`p-2 rounded-xl ${
                          isIncome 
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.category}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <span 
                      className={`font-semibold ${
                        isIncome 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Widget 2: Top Categories Bar */}
        <div className="bg-surface dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Top Expenses
            </h3>
          </div>

          <div className="flex flex-col gap-5 mt-2 flex-1">
            {topCategories.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[150px]">
                No expenses in this period.
              </div>
            ) : (
              topCategories.map((cat, index) => {
                const percent = maxCategoryAmount > 0 ? (cat.amount / maxCategoryAmount) * 100 : 0;
                
                return (
                  <div key={index} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {cat.name}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;