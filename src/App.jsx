// src/App.jsx
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import ThemeToggle from './components/ThemeToggle';
import RoleSwitcher from './components/RoleSwitcher';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'transactions' && <Transactions />}
          {activePage === 'insights' && <Insights />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <AppProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl text-sm font-medium',
          duration: 3000,
        }}
      />

      {/* Main Layout Wrapper: Added dark:bg-slate-900 and dark:text-slate-100 */}
      <div className="flex h-screen bg-background dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors">
        
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header: Added dark:bg-slate-900 and dark:border-slate-800 */}
          <header className="h-20 bg-surface dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 transition-colors">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 md:hidden rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Menu size={20} />
              </button>
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white capitalize">
                {activePage}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <RoleSwitcher />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;