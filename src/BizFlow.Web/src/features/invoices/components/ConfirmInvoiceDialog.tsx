import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConfirmInvoiceDialogProps {
  isOpen: boolean;
  isConfirming: boolean;
  invoiceNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmInvoiceDialog: React.FC<ConfirmInvoiceDialogProps> = ({
  isOpen,
  isConfirming,
  invoiceNumber,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Confirm Invoice</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to confirm Invoice <strong>{invoiceNumber}</strong>? This will deduct the items from stock and finalize the invoice. This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
