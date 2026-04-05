# Zorlytics

## Overview
Zorlytics is a comprehensive client-side financial management dashboard built with React. Designed with a focus on real-world usability and a clean, modern user interface, the application allows users to track expenses, analyze spending habits, and manage transactions seamlessly.

By leveraging advanced state management and local storage persistence, Zorlytics delivers a robust, production-ready experience without requiring a backend, making it highly responsive and accessible.

**Live Demo**
- Live Demo Link: [Zorlytics-Financial-Dashboard](https://zorlytics-financial-dashboard.vercel.app/)

---

## Features

### Dashboard & Analytics
- Summary cards displaying total balance, income, and expenses  
- Interactive Area and Pie charts for data visualization  
- Global time-based filtering (This Month, Last 3 Months, Last 6 Months, All Time)  

### Transactions Management
- Full CRUD (Create, Read, Update, Delete) functionality  
- Advanced table with search, category filtering, and sorting  
- Bulk selection and deletion  
- Form validation for accurate data entry  

### Insights System
- Dynamic spending pattern analysis  
- Algorithm-based savings suggestions  
- Budget tracking with visual progress indicators  

### UI/UX Enhancements
- System-aware Dark/Light mode with persistence  
- Fully responsive design (desktop, tablet, mobile)  
- Smooth animations using Framer Motion  
- Toast notifications for feedback  

### State Management
- Centralized state using Context API  
- Sync with browser local storage  

---

## Tech Stack

- **Core:** React, Context API  
- **Styling:** Tailwind CSS  
- **Charts:** Recharts  
- **Animations:** Framer Motion  
- **Icons & Notifications:** Lucide React, React Hot Toast  
- **Persistence:** Browser Local Storage  

---

## Key Highlights

### Role-Based UI
The application includes a role-switching mechanism (Admin vs Viewer).  
Viewer mode restricts access to all modification actions such as add, edit, delete, and bulk operations.

### Dynamic Filtering
A centralized time filter updates all components (charts, cards, activity) instantly based on selected date ranges.

### Smart Insights Logic
Insights are generated dynamically using transaction data, including:
- Category-wise spending analysis  
- Peak expense identification  
- Actionable financial suggestions  

### Scalable Frontend Architecture
The project follows clean coding practices with:
- Component-based structure  
- Separation of logic and UI  
- Maintainable and scalable design  

---

## How It Works

1. **Data:** Transactions are loaded from local storage  
2. **State:** Context API manages global state  
3. **UI:** Components update reactively based on state changes  
4. **Insights:** Utility functions analyze data and generate insights  

---

## Installation & Setup

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

---

## Folder Structure
```text
src/
├── components/       # Reusable UI components
├── context/          # Global state management
├── data/             # Mock data
├── pages/            # Dashboard, Transactions, Insights
├── utils/            # Helper functions
├── App.jsx           # Root component
└── main.jsx          # Entry point
```

---

## Future Improvements
- **Backend Integration:** Transition from local storage to a dedicated backend architecture (Node.js/Express) with a robust database (PostgreSQL/MongoDB).
- **Authentication & Authorization:** Implement secure user login via JWT or OAuth providers to handle individual user sessions securely.
- **API-Based Data:** Integrate real-world banking or financial API services for live transaction syncing and currency conversion.

---

## Author
**Nihar Padave**
- **Github:** [NIHAR-2812](https://github.com/NIHAR-2812)
- **LinkedIn:** [niharpadave281206](https://www.linkedin.com/in/niharpadave281206/)
- **Email:** niharrr2806@gmail.com
