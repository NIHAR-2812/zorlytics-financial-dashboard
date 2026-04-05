// src/pages/Transactions.jsx
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import TransactionsTable from '../components/TransactionsTable';
import { Plus, Download, ChevronLeft, ChevronRight, Search, X, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { 
    transactions, 
    userRole, 
    deleteMultipleTransactions, 
    addTransaction, 
    updateTransaction 
  } = useContext(AppContext);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: ''
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Data Processing (Filter, Search, Sort)
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const cleanSearch = searchTerm.toLowerCase().trim();
      result = result.filter(t => {
        const categoryLower = t.category.toLowerCase();
        return (
          categoryLower.startsWith(cleanSearch) || 
          categoryLower.split(' ').some(word => word.startsWith(cleanSearch))
        );
      });
    }

    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      switch (sortBy) {
        case 'date-desc':
          return dateB - dateA;
        case 'date-asc':
          return dateA - dateB;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, searchTerm, filterType, sortBy]);

  const isViewer = userRole === 'viewer';

  // Reset pagination and selection when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]); 
  }, [searchTerm, filterType, sortBy]);

  // Pagination Calculations
  const totalItems = processedTransactions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedTransactions = processedTransactions.slice(startIndex, endIndex);

  // Calculate Net Total
  const summaryTotal = useMemo(() => {
    return processedTransactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }, [processedTransactions]);

  // --- Handlers ---
  
  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedTransactions.map(t => t.id)); 
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
      deleteMultipleTransactions(selectedIds);
      setSelectedIds([]); 
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      type: 'expense', 
      date: new Date().toISOString().split('T')[0], 
      category: '', 
      amount: '' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingId(transaction.id);
    setFormData({ 
      type: transaction.type, 
      date: transaction.date, 
      category: transaction.category, 
      amount: transaction.amount 
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount) 
    };

    if (editingId) {
      updateTransaction({ ...payload, id: editingId });
    } else {
      addTransaction(payload);
    }
    setIsModalOpen(false);
  };

  // --- UPDATED: Smart CSV Export Handler ---
  const handleExportCSV = () => {
    // Determine which data to export: explicitly selected rows, or all filtered rows
    const dataToExport = selectedIds.length > 0 
      ? processedTransactions.filter(t => selectedIds.includes(t.id))
      : processedTransactions;

    if (!dataToExport || dataToExport.length === 0) {
      toast.error('No transactions to export!');
      return;
    }

    const headers = ['Date', 'Category', 'Type', 'Amount (₹)'];

    const csvRows = dataToExport.map(t => [
      t.date,
      `"${t.category}"`, 
      t.type,
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    
    // Make the filename dynamic based on whether it is a partial or full export
    const filePrefix = selectedIds.length > 0 ? 'selected' : 'all';
    link.setAttribute('download', `findash_${filePrefix}_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(
      selectedIds.length > 0 
        ? `${selectedIds.length} selected transactions exported!` 
        : 'All visible transactions exported!'
    );
  };

  // Shared CSS class for modal form inputs
  const sharedInputClasses = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white";

  return (
    <div className="space-y-6 relative">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Transaction History
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your income and expenses.
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 border border-slate-200 dark:border-slate-700 bg-surface text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm md:text-base whitespace-nowrap"
          >
            <Download size={16} className="md:w-5 md:h-5" />
            <span>{selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export CSV'}</span>
          </button>
          
          <div className="relative group flex-1 sm:flex-none">
            <button 
              disabled={isViewer}
              onClick={openAddModal}
              className="w-full flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={16} className="md:w-5 md:h-5" />
              <span>Add Transaction</span>
            </button>
            {isViewer && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                Viewers cannot add transactions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="dark:bg-slate-700 border border-blue-100 dark:border-slate-700 px-4 py-3 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Found <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span> transactions 
            (Net: <span className={`font-bold ${summaryTotal >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {formatCurrency(summaryTotal)}
            </span>)
          </div>
          
          {selectedIds.length > 0 && !isViewer && (
             <button 
               onClick={handleBulkDelete} 
               className="animate-fade-in flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
               <Trash2 size={16} />
               Delete {selectedIds.length} Selected
             </button>
          )}
        </div>

        <TransactionsTable 
          data={paginatedTransactions} 
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onEdit={openEditModal} 
        />
        
        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6 mt-2 gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-2 rounded-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select 
                  required
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className={sharedInputClasses}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={sharedInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Groceries, Rent, Salary"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={sharedInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount (₹)
                </label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className={sharedInputClasses}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
                >
                  {editingId ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Transactions;