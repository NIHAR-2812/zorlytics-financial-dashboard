// src/pages/Insights.jsx
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Lightbulb, Target, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Insights = () => {
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

  // Calculate smart insights and savings potential
  const { topCategory, topAmount, savingsPotential, totalExpense } = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === 'expense');
    let total = 0;
    
    const grouped = expenses.reduce((acc, curr) => {
      total += curr.amount;
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    let highestCategory = 'None';
    let highestAmount = 0;
    
    for (const [cat, amt] of Object.entries(grouped)) {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    }
    
    return {
      topCategory: highestCategory,
      topAmount: highestAmount,
      savingsPotential: highestAmount * 0.15, 
      totalExpense: total
    };
  }, [filteredTransactions]);

  // Dynamic budget scaling logic
  const BASE_MONTHLY_BUDGET = 5000; 
  
  const multiplierMap = {
    'this-month': 1,
    '3-months': 3,
    '6-months': 6,
    'all': 12 // Approximating a yearly view for 'all'
  };
  
  const periodMultiplier = multiplierMap[timeFilter] || 1;
  const currentBudget = BASE_MONTHLY_BUDGET * periodMultiplier;
  
  const budgetUsedPercent = Math.min((totalExpense / currentBudget) * 100, 100);
  const isOverBudget = totalExpense > currentBudget;
  const remainingBudget = currentBudget - totalExpense;

  // Prepare data for the monthly comparison chart
  const monthlyData = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const monthYear = date.toLocaleString('default', { month: 'short' }); 
      
      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, income: 0, expense: 0 };
      }
      
      if (curr.type === 'income') acc[monthYear].income += curr.amount;
      if (curr.type === 'expense') acc[monthYear].expense += curr.amount;
      return acc;
    }, {});

    const monthOrder = { 
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 
    };
    
    return Object.values(grouped).sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Smart Insights</h2>
          <p className="text-slate-500 dark:text-slate-400">AI-generated analysis of your spending habits.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Goal Tracker */}
        <div className="lg:col-span-2 bg-surface dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Period Budget Goal</h3>
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Budget: {formatCurrency(currentBudget)}
              </p>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {formatCurrency(totalExpense)} <span className="text-sm font-medium text-slate-500">used</span>
              </h4>
            </div>
            <div className={`text-right font-medium ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
              {isOverBudget 
                ? `Over budget by ${formatCurrency(Math.abs(remainingBudget))}` 
                : `${formatCurrency(remainingBudget)} remaining`
              }
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${budgetUsedPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Widget 2: Savings Suggestion */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-md text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={20} className="text-yellow-300" />
              <h3 className="text-lg font-semibold text-white">Smart Tip</h3>
            </div>
            
            {topCategory === 'None' ? (
               <p className="text-indigo-100 leading-relaxed">
                 Not enough expense data in this period to generate a tip.
               </p>
            ) : (
              <>
                <p className="text-indigo-100 leading-relaxed">
                  Your highest expense is <strong className="text-white">{topCategory}</strong> at {formatCurrency(topAmount)}.
                </p>
                <div className="mt-4 bg-white/20 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-start gap-3">
                   <TrendingUp size={18} className="text-emerald-300 shrink-0 mt-0.5" />
                   <p className="text-sm font-medium">
                     Reduce {topCategory} spending by 15% to save <span className="text-yellow-300 font-bold">{formatCurrency(savingsPotential)}</span>!
                   </p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Widget 3: Monthly Comparison Chart */}
      <div className="bg-surface dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Wallet size={20} className="text-emerald-500" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Comparison</h3>
        </div>
        
        {monthlyData.length === 0 ? (
          <div className="h-[350px] w-full flex items-center justify-center text-slate-400">
            No data available for this period.
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dx={2} 
                  tickFormatter={(val) => `₹${val}`} 
                />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.1 }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' 
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};

export default Insights;