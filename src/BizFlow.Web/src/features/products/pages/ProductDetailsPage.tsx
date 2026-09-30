import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { ArrowLeft, Package, Tag, AlertTriangle } from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading product details.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{product.name}</h1>
            <p className="text-sm text-slate-400 flex items-center mt-1">
              <Tag className="mr-1.5 h-4 w-4" /> {product.categoryName || 'Uncategorized'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-6">
            <h3 className="text-lg font-medium text-white mb-4 border-b border-white/[0.08] pb-2">Product Description</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          <div className="premium-card p-6">
            <h3 className="text-lg font-medium text-white mb-4 border-b border-white/[0.08] pb-2">Pricing Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-400 mb-1">Selling Price</p>
                <p className="text-2xl font-bold text-white">${product.price.toFixed(2)}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-400 mb-1">Cost Price</p>
                <p className="text-xl font-semibold text-slate-300">${product.costPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card p-6">
            <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Inventory Status</h3>
            <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] border border-white/[0.08] rounded-lg mb-4">
              <span className="text-5xl font-black tracking-tight text-white">{product.quantity}</span>
              <span className="text-sm font-medium text-slate-400 mt-2">Units in Stock</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.08] border-dashed">
                <span className="text-sm text-slate-400 flex items-center">
                   <AlertTriangle className="mr-2 h-4 w-4" /> Min Level
                </span>
                <span className="text-sm font-medium text-white">{product.minimumStockLevel} units</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.08] border-dashed">
                <span className="text-sm text-slate-400">Status</span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  product.stockStatus === 'InStock' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' :
                  product.stockStatus === 'LowStock' ? 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20' :
                  'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                }`}>
                  {product.stockStatus === 'InStock' ? 'In Stock' : product.stockStatus === 'LowStock' ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Active Listing</span>
                <span className="text-sm font-medium text-white">{product.isActive ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
