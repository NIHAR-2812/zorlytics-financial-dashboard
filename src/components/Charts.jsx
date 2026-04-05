// src/components/Charts.jsx
import React, { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Sector, 
  Legend 
} from 'recharts';

// Moved COLORS constant outside the component to prevent recreation on every render
const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#a855f7', '#ef4444'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text 
        x={cx} 
        y={cy - 12} 
        textAnchor="middle" 
        fill={fill} 
        style={{ fontSize: '16px', fontWeight: 'bold' }} 
        className="md:text-[18px]"
      >
        {payload.name}
      </text>
      
      <text 
        x={cx} 
        y={cy + 12} 
        textAnchor="middle" 
        fill="#94a3b8" 
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        ₹{value.toLocaleString()}
      </text>
      
      <text 
        x={cx} 
        y={cy + 30} 
        textAnchor="middle" 
        fill="#64748b" 
        style={{ fontSize: '12px' }}
      >
        {(percent * 100).toFixed(1)}%
      </text>

      <Sector 
        cx={cx} 
        cy={cy} 
        innerRadius={innerRadius} 
        outerRadius={outerRadius + 8} 
        startAngle={startAngle} 
        endAngle={endAngle} 
        fill={fill} 
      />
      
      <Sector 
        cx={cx} 
        cy={cy} 
        startAngle={startAngle} 
        endAngle={endAngle} 
        innerRadius={outerRadius + 12} 
        outerRadius={outerRadius + 16} 
        fill={fill} 
      />
    </g>
  );
};

const CustomScrollableLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-h-[72px] overflow-y-auto mt-2 px-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center shrink-0">
          <div 
            className="w-2.5 h-2.5 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const Charts = ({ transactions = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [transactions]);

  const lineData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    
    return sorted.map(t => {
      currentBalance += t.type === 'income' ? t.amount : -t.amount;
      const shortDate = t.date.split('-').slice(1).join('/'); 
      return { date: shortDate, balance: currentBalance };
    });
  }, [transactions]);

  const onPieEnter = (_, index) => setActiveIndex(index);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      
      {/* Balance History Chart */}
      <div className="lg:col-span-2 bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-4 md:mb-6">
          Balance History
        </h3>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#334155" 
                opacity={0.2} 
              />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                dx={-2} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} 
                itemStyle={{ color: '#e2e8f0' }} 
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#0ea5e9" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category Chart */}
      <div className="bg-surface dark:bg-slate-800/50 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors flex flex-col">
        <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-2">
          Expenses by Category
        </h3>
        
        {pieData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[250px]">
            No expenses to show.
          </div>
        ) : (
          <div className="flex-1 flex flex-col w-full h-full min-h-[280px]">
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    activeIndex={activeIndex} 
                    activeShape={renderActiveShape} 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={3} 
                    dataKey="value" 
                    stroke="none" 
                    onMouseEnter={onPieEnter}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    content={<CustomScrollableLegend />} 
                    verticalAlign="bottom" 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;