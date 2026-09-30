import React from 'react';
import type { ProductDto } from '../../../services/productService';
import { Edit2, PackagePlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductTableProps {
  data: ProductDto[];
  isLoading: boolean;
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (product: ProductDto) => void;
  onAdjustStock: (product: ProductDto) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'InStock':
      return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">In Stock</span>;
    case 'LowStock':
      return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Low Stock</span>;
    case 'OutOfStock':
      return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Out of Stock</span>;
    default:
      return <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">{status}</span>;
  }
};

export const ProductTable: React.FC<ProductTableProps> = ({
  data,
  isLoading,
  pageNumber,
  totalPages,
  onPageChange,
  onEdit,
  onAdjustStock,
}) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/[0.08]">
          <thead>
            <tr>
              <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-slate-300 sm:pl-6">Product</th>
              <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
              <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-300">Stock</th>
              <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em]" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                  No products found.
                </td>
              </tr>
            ) : (
              data.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      {product.categoryName && <span className="text-xs text-slate-400 font-normal">{product.categoryName}</span>}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                    {product.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                    {getStatusBadge(product.stockStatus)}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                    <button onClick={() => onAdjustStock(product)} className="text-emerald-400 hover:text-emerald-300 inline-flex items-center transition-colors" title="Adjust Stock">
                      <PackagePlus className="h-4 w-4" />
                    </button>
                    <Link to={`/products/${product.id}`} className="text-indigo-400 hover:text-indigo-300 inline-block transition-colors" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button onClick={() => onEdit(product)} className="text-slate-400 hover:text-white inline-block transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-4 sm:px-6 mt-2">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="relative inline-flex items-center rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.06] disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              className="relative ml-3 inline-flex items-center rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.06] disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Page <span className="font-medium text-white">{pageNumber}</span> of <span className="font-medium text-white">{totalPages || 1}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pageNumber - 1)}
                  disabled={pageNumber === 1}
                  className="relative inline-flex items-center rounded-l-lg px-3 py-2 text-slate-400 border border-white/[0.1] hover:bg-white/[0.05] focus:z-20 disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(pageNumber + 1)}
                  disabled={pageNumber === totalPages || totalPages === 0}
                  className="relative inline-flex items-center rounded-r-lg px-3 py-2 text-slate-400 border border-white/[0.1] border-l-0 hover:bg-white/[0.05] focus:z-20 disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
