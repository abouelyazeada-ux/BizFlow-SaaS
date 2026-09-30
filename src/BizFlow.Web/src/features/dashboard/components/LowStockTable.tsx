import React from 'react';
import type { ProductSummaryDto } from '../types/dashboard.types';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LowStockTableProps {
  products: ProductSummaryDto[];
  isLoading: boolean;
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products, isLoading }) => {
  return (
    <div className="premium-card overflow-hidden flex flex-col h-full relative z-10">
      <div className="p-6 border-b border-white/[0.08] flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
            Low Stock Alerts
          </h3>
          <p className="text-sm text-slate-400 mt-1">Products at or below minimum threshold.</p>
        </div>
        <Link to="/products?filter=low-stock" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">View all</Link>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        <table className="min-w-full divide-y divide-white/[0.08]">
          <thead className="bg-[#0A0A0A]/50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-4 bg-white/[0.05] rounded w-3/4 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-white/[0.05] rounded w-1/4 animate-pulse ml-auto"></div></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">
                  Inventory is healthy. No low stock items.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-white">
                    <Link to={`/products/${product.id}`} className="hover:text-indigo-300 transition-colors">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold text-rose-400">
                    {product.quantity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
