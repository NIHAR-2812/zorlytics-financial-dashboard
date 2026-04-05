// src/components/RoleSwitcher.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleSwitcher = () => {
  const { userRole, setUserRole } = useContext(AppContext);

  // Define available roles to map over and maintain DRY principles
  const roles = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'viewer', label: 'Viewer', icon: Eye }
  ];

  return (
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
      
      {roles.map((role) => {
        const isActive = userRole === role.id;
        const Icon = role.icon;

        return (
          <button
            key={role.id}
            onClick={() => setUserRole(role.id)}
            className={`
              relative flex items-center justify-center gap-2 px-2.5 sm:px-3 py-1.5 
              rounded-lg text-sm font-medium transition-colors z-10 focus:outline-none 
              ${isActive 
                ? 'text-primary dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }
            `}
            title={`Switch to ${role.label} mode`}
          >
            {isActive && (
              <motion.div
                layoutId="role-pill"
                className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            <Icon size={16} />
            <span className="hidden sm:inline">{role.label}</span>
          </button>
        );
      })}
      
    </div>
  );
};

export default RoleSwitcher;