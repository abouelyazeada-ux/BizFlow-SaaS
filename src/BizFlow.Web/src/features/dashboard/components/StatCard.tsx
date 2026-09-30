import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, isLoading, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`premium-card p-[26px] relative overflow-hidden group ${onClick ? 'cursor-pointer hover:border-indigo-500/30 transition-all duration-300' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-[15px] font-medium text-slate-400 tracking-wide">{title}</h3>
        <div className="p-3 bg-indigo-500/10 rounded-[12px] text-indigo-400 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-10 w-2/3 bg-white/[0.05] rounded-[10px] animate-pulse"></div>
      ) : (
        <div className="flex flex-col space-y-2.5 relative z-10">
          <p className="text-[32px] font-semibold text-slate-100 tracking-tight leading-none">{value}</p>
          {trend && (
            <div className={`flex items-center text-[14px] font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <div className={`mr-1.5 p-1 rounded-md ${trend.isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              </div>
              {trend.value}% <span className="text-slate-500 ml-1.5 font-normal">from last month</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
