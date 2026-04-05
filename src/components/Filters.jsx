// src/components/Filters.jsx
import React from 'react';
import { Search } from 'lucide-react';

const Filters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div className="bg-surface p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Search Bar Section */}
      <div className="relative w-full md:w-96">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          size={18} 
        />
        <input
          type="text"
          placeholder="Search by category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
        />
      </div>

      {/* Dropdowns Section */}
      <div className="flex gap-3 w-full md:w-auto">
        
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
        
      </div>
    </div>
  );
};

export default Filters;