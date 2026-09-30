import React from 'react';

interface InvoiceSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ subtotal, discount, tax, total }) => {
  return (
    <div className="bg-white/[0.02] p-6 rounded-lg border border-white/[0.08] w-full max-w-sm ml-auto relative z-10 backdrop-blur-md">
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Discount</span>
          <span className="font-medium text-rose-400">-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400 border-b border-white/[0.08] pb-3">
          <span>Tax</span>
          <span className="font-medium text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-white pt-2">
          <span>Total Amount</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
