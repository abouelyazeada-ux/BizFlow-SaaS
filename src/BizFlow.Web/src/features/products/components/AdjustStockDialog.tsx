import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { ProductDto } from '../../../services/productService';

interface AdjustStockDialogProps {
  isOpen: boolean;
  product: ProductDto | undefined;
  isAdjusting: boolean;
  onConfirm: (quantity: number, reason: string) => Promise<void>;
  onCancel: () => void;
}

export const AdjustStockDialog: React.FC<AdjustStockDialogProps> = ({
  isOpen,
  product,
  isAdjusting,
  onConfirm,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum === 0) {
      setError('Please enter a valid non-zero quantity to adjust (+ or -).');
      return;
    }
    if (product.quantity + qtyNum < 0) {
      setError(`Cannot reduce stock below zero. Current stock is ${product.quantity}.`);
      return;
    }
    
    setError('');
    await onConfirm(qtyNum, reason || 'Manual adjustment');
    
    // Reset form
    setQuantity('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Adjust Stock: {product.name}</h3>
        <p className="text-sm text-slate-500 mb-6">
          Current Stock: <strong>{product.quantity}</strong>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Adjustment Quantity (+ or -) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50 or -10"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Restock, Damaged goods"
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isAdjusting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdjusting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isAdjusting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
