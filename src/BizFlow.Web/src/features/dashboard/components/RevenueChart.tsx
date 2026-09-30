import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueDataPoint } from '../types/dashboard.types';

interface RevenueChartProps {
  data: RevenueDataPoint[];
  isLoading: boolean;
  onClick?: () => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`premium-card p-6 flex flex-col h-full ${onClick ? 'cursor-pointer hover:border-indigo-500/30 transition-all duration-300 group' : ''}`}
    >
      <div className="mb-6 relative z-10">
        <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
        <p className="text-sm text-slate-400">Daily revenue performance for the selected period.</p>
      </div>

      <div className="flex-1 min-h-[300px] relative z-10">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-4">
            <h4 className="text-white font-medium mb-2">No sales data yet</h4>
            <p className="text-slate-400 text-sm mb-4 text-center">Create your first invoice to start seeing revenue analytics.</p>
            <Link 
              to="/invoices/new" 
              onClick={(e) => e.stopPropagation()} 
              className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-colors"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff1a" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
