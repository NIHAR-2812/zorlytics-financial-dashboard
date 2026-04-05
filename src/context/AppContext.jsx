// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedData = localStorage.getItem('findash_transactions');
      if (savedData) {
        return JSON.parse(savedData);
      }
      return initialTransactions;
    } catch (error) {
      console.error("Failed to parse local storage data:", error);
      return initialTransactions;
    }
  });

  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    localStorage.setItem('findash_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    
    setTransactions((prevTransactions) => [transactionWithId, ...prevTransactions]);
    toast.success('Transaction added successfully!'); 
  };

  const deleteTransaction = (id) => {
    setTransactions((prevTransactions) => 
      prevTransactions.filter((t) => t.id !== id)
    );
    toast.success('Transaction deleted!'); 
  };
  
  const deleteMultipleTransactions = (idsToDelete) => {
    setTransactions((prevTransactions) => 
      prevTransactions.filter((t) => !idsToDelete.includes(t.id))
    );
    toast.success(`${idsToDelete.length} transactions deleted!`); 
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions((prevTransactions) => 
      prevTransactions.map((t) => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    toast.success('Transaction updated successfully!'); 
  };

  return (
    <AppContext.Provider 
      value={{ 
        transactions, 
        userRole, 
        setUserRole,
        addTransaction,
        deleteTransaction,
        deleteMultipleTransactions,
        updateTransaction 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};