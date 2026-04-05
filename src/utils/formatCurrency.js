// src/utils/formatCurrency.js

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0, // Removes the .00 for cleaner UI
    maximumFractionDigits: 0,
  }).format(amount);
};