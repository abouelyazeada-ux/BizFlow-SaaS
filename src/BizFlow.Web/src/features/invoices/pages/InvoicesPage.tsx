import { useState } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { useDeleteInvoice, useConfirmInvoice, useCancelInvoice } from '../hooks/useInvoiceMutations';
import { InvoiceTable } from '../components/InvoiceTable';
import { ConfirmInvoiceDialog } from '../components/ConfirmInvoiceDialog';
import { CancelInvoiceDialog } from '../components/CancelInvoiceDialog';
import type { InvoiceDto } from '../../../services/invoiceService';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const InvoicesPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmingInvoice, setConfirmingInvoice] = useState<InvoiceDto | undefined>(undefined);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelingInvoice, setCancelingInvoice] = useState<InvoiceDto | undefined>(undefined);

  const { data, isLoading } = useInvoices({ pageNumber, pageSize });
  const deleteMutation = useDeleteInvoice();
  const confirmMutation = useConfirmInvoice(confirmingInvoice?.id || '');
  const cancelMutation = useCancelInvoice(cancelingInvoice?.id || '');

  const handleDelete = async (invoice: InvoiceDto) => {
    if (window.confirm(`Are you sure you want to delete draft invoice ${invoice.invoiceNumber}?`)) {
      await deleteMutation.mutateAsync(invoice.id);
    }
  };

  const handleOpenConfirm = (invoice: InvoiceDto) => {
    setConfirmingInvoice(invoice);
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (confirmingInvoice) {
      await confirmMutation.mutateAsync();
      setIsConfirmOpen(false);
    }
  };

  const handleOpenCancel = (invoice: InvoiceDto) => {
    setCancelingInvoice(invoice);
    setIsCancelOpen(true);
  };

  const handleCancelSubmit = async () => {
    if (cancelingInvoice) {
      await cancelMutation.mutateAsync();
      setIsCancelOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Invoices</h1>
          <p className="mt-2 text-sm text-slate-400 font-light">
            Create, track, and manage billing for your customers.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/invoices/new">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 h-[clamp(3rem,2.8rem+1vw,3.25rem)] text-base font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 transition-colors w-full sm:w-auto cursor-pointer"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Invoice
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <InvoiceTable
          data={data?.items || []}
          isLoading={isLoading}
          pageNumber={data?.pageNumber || 1}
          totalPages={data?.totalPages || 1}
          onPageChange={setPageNumber}
          onDelete={handleDelete}
          onConfirm={handleOpenConfirm}
          onCancel={handleOpenCancel}
        />
      </div>

      <ConfirmInvoiceDialog
        isOpen={isConfirmOpen}
        isConfirming={confirmMutation.isPending}
        invoiceNumber={confirmingInvoice?.invoiceNumber || ''}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <CancelInvoiceDialog
        isOpen={isCancelOpen}
        isCancelling={cancelMutation.isPending}
        invoiceNumber={cancelingInvoice?.invoiceNumber || ''}
        onConfirm={handleCancelSubmit}
        onCancel={() => setIsCancelOpen(false)}
      />
    </motion.div>
  );
};
