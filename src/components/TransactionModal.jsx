// src/components/TransactionModal.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useContext(AppContext);
  
  // Base state definition to maintain DRY principles for initialization and reset
  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense'
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent submission if required fields are missing
    if (!formData.amount || !formData.category) return;

    // Convert amount string to a number payload
    addTransaction({
      ...formData,
      amount: Number(formData.amount)
    });
    
    // Reset form and close modal
    setFormData(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            Add Transaction
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <input
              type="text" 
              required 
              placeholder="e.g., Groceries, Salary, Rent"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number" 
              required 
              min="1" 
              step="any" 
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition-colors mt-2"
          >
            Save Transaction
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;