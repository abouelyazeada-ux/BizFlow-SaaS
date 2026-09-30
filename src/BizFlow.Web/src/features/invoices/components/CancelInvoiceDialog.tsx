import React from 'react';
import { Loader2 } from 'lucide-react';

interface CancelInvoiceDialogProps {
  isOpen: boolean;
  isCancelling: boolean;
  invoiceNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CancelInvoiceDialog: React.FC<CancelInvoiceDialogProps> = ({
  isOpen,
  isCancelling,
  invoiceNumber,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Cancel Invoice</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to cancel Invoice <strong>{invoiceNumber}</strong>? 
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
