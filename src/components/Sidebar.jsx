// src/components/Sidebar.jsx
import React from 'react';
import { Wallet, LayoutDashboard, ArrowRightLeft, Lightbulb } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Dark Overlay Background for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-slate-200 
          flex flex-col transition-transform duration-300 ease-in-out 
          md:relative md:translate-x-0 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-200 shrink-0">
          <div className="bg-primary p-2 rounded-xl text-white">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Zorlytics
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false); // Auto-close on mobile
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-r-xl transition-all duration-200 ease-in-out text-left border-l-4 
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-primary font-bold' 
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800' 
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-slate-400'}`} 
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;