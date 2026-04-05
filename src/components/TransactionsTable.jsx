// src/components/TransactionsTable.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Edit2 } from 'lucide-react'; 
import { formatCurrency } from '../utils/formatCurrency';

const TransactionsTable = ({ data, selectedIds = [], onSelect, onSelectAll, onEdit }) => {
  const { userRole, deleteTransaction } = useContext(AppContext);
  const isAdmin = userRole === 'admin';

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl bg-transparent mt-4 px-4 text-center">
        No transactions found matching your criteria.
      </div>
    );
  }

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="overflow-x-auto mt-4 border border-slate-200 dark:border-slate-700 rounded-2xl w-full scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
      <table className="w-full text-left border-collapse min-w-[600px] bg-transparent">
        
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300">
            {isAdmin && (
              <th className="p-3 md:p-4 w-10 md:w-12 rounded-tl-2xl">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  aria-label="Select all transactions"
                  className="w-4 h-4 md:w-4.5 md:h-4.5 rounded border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-700 text-primary focus:ring-primary cursor-pointer transition-colors"
                />
              </th>
            )}
            <th className={`p-3 md:p-4 whitespace-nowrap ${!isAdmin ? 'rounded-tl-2xl' : ''}`}>
              Date
            </th>
            <th className="p-3 md:p-4 whitespace-nowrap">Category</th>
            <th className="p-3 md:p-4 whitespace-nowrap">Type</th>
            <th className="p-3 md:p-4 whitespace-nowrap">Amount</th>
            {isAdmin && (
              <th className="p-3 md:p-4 text-center whitespace-nowrap rounded-tr-2xl">
                Action
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((t, index) => {
            const isLast = index === data.length - 1;
            const isSelected = selectedIds.includes(t.id);

            return (
              <tr 
                key={t.id} 
                className={`
                  transition-colors duration-200 text-sm 
                  ${isSelected 
                    ? 'bg-blue-500/10 dark:bg-blue-500/20' 
                    : 'bg-transparent hover:bg-slate-500/5 dark:hover:bg-slate-500/10'
                  } 
                  ${isLast ? '' : 'border-b border-slate-200/50 dark:border-slate-700/50'}
                `}
              >
                {isAdmin && (
                  <td className="p-3 md:p-4">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => onSelect(t.id)}
                      aria-label={`Select transaction for ${t.category}`}
                      className="w-4 h-4 md:w-4.5 md:h-4.5 rounded border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-700 text-primary focus:ring-primary cursor-pointer transition-colors"
                    />
                  </td>
                )}
                
                <td className="p-3 md:p-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {t.date}
                </td>
                
                <td className="p-3 md:p-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                  {t.category}
                </td>
                
                <td className="p-3 md:p-4 whitespace-nowrap">
                  <span 
                    className={`
                      px-2.5 py-1 rounded-full text-[11px] md:text-xs font-medium tracking-wide 
                      ${t.type === 'income' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                      }
                    `}
                  >
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
                
                <td 
                  className={`
                    p-3 md:p-4 whitespace-nowrap font-semibold tracking-tight 
                    ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}
                  `}
                >
                  {t.type === 'income' ? '+ ' : '- '}
                  {formatCurrency(t.amount)}
                </td>
                
                {isAdmin && (
                  <td className="p-3 md:p-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button
                        onClick={() => onEdit && onEdit(t)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        title="Edit Transaction"
                        aria-label="Edit transaction"
                      >
                        <Edit2 size={18} className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                        title="Delete Transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 size={18} className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;