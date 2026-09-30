import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomers';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building2 } from 'lucide-react';

export const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, error } = useCustomer(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading customer details.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link to="/customers" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Customers
        </Link>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-2xl font-bold border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{customer.name}</h1>
            <p className="text-sm text-slate-400 flex items-center mt-1">
              <Building2 className="mr-1.5 h-4 w-4" /> Customer ID: {customer.id.substring(0, 8)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-6">
            <h3 className="text-lg font-medium text-white mb-4 border-b border-white/[0.08] pb-2">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-indigo-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Email Address</p>
                  <p className="text-sm text-slate-400">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-indigo-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Phone Number</p>
                  <p className="text-sm text-slate-400">{customer.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Billing Address</p>
                  <p className="text-sm text-slate-400">{customer.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-6">
            <h3 className="text-lg font-medium text-white mb-4 border-b border-white/[0.08] pb-2">Notes</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {customer.notes || 'No notes available for this customer.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 relative z-10 backdrop-blur-md">
            <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Account Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.08] border-dashed">
                <span className="text-sm flex items-center text-slate-400"><Calendar className="mr-2 h-4 w-4" /> Created</span>
                <span className="text-sm font-medium text-white">{new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.08] border-dashed">
                <span className="text-sm text-slate-400">Status</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Active</span>
              </div>
            </div>
          </div>
          
          <div className="premium-card p-6 border-l-4 border-l-indigo-500">
             <h3 className="text-sm font-medium text-white mb-1">Invoices & Billing</h3>
             <p className="text-xs text-slate-400 mb-4">Financial overview will appear here.</p>
             <div className="h-24 bg-white/[0.02] rounded border border-dashed border-white/[0.1] flex items-center justify-center text-sm text-slate-500">
               Coming soon in Phase 4 Part 4
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
