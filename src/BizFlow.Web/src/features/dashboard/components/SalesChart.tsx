import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueDataPoint } from '../types/dashboard.types';

interface SalesChartProps {
  data: RevenueDataPoint[];
  isLoading: boolean;
  onClick?: () => void;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`premium-card p-6 flex flex-col h-full ${onClick ? 'cursor-pointer hover:border-indigo-500/30 transition-all duration-300 group' : ''}`}
    >
      <div className="mb-6 relative z-10">
        <h3 className="text-base font-semibold text-white">Invoices Issued</h3>
        <p className="text-sm text-slate-400">Number of invoices created per day.</p>
      </div>

      <div className="flex-1 min-h-[300px] relative z-10">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center px-4">
            <h4 className="text-white font-medium mb-2">No invoices found</h4>
            <p className="text-slate-400 text-sm mb-4 text-center">Your invoice activity will appear here.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
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
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: any) => [value, 'Invoices']}
              />
              <Bar 
                dataKey="invoiceCount" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
