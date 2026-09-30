import { useParams, Link } from 'react-router-dom';
import { useInvoice } from '../hooks/useInvoices';
import { InvoiceSummary } from '../components/InvoiceSummary';
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge';
import { ArrowLeft, FileText, Calendar, User } from 'lucide-react';

export const InvoiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading, error } = useInvoice(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading invoice details.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link to="/invoices" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Invoice {invoice.invoiceNumber}</h1>
              <div className="flex items-center space-x-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center"><User className="mr-1.5 h-4 w-4" /> {invoice.customerName}</span>
                <span className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" /> {new Date(invoice.invoiceDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
          <h3 className="text-base font-semibold leading-6 text-white">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.08]">
            <thead className="bg-[#0A0A0A]/50">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-slate-400">Product</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-400">Quantity</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-slate-400">Unit Price</th>
                <th scope="col" className="py-3.5 pl-3 pr-6 text-right text-sm font-semibold text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white">
                    {item.productNameSnapshot}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400 text-right">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400 text-right">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-sm text-white font-medium text-right">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-6 border-t border-white/[0.08] flex justify-end">
          <InvoiceSummary 
            subtotal={invoice.subTotal} 
            discount={invoice.discount} 
            tax={invoice.tax} 
            total={invoice.total} 
          />
        </div>
      </div>
    </div>
  );
};
