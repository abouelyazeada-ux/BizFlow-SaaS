import { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomerMutations';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerForm } from '../components/CustomerForm';
import { DeleteCustomerDialog } from '../components/DeleteCustomerDialog';
import type { CustomerDto } from '../../../services/customerService';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomersPage = () => {
  // State for List
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  // State for Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | undefined>(undefined);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerDto | undefined>(undefined);

  // Queries & Mutations
  const { data, isLoading } = useCustomers({ pageNumber, pageSize, searchTerm });
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer(editingCustomer?.id || '');
  const deleteMutation = useDeleteCustomer();

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPageNumber(1); // Reset to first page on search
  };

  const handleOpenCreate = () => {
    setEditingCustomer(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer: CustomerDto) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (customer: CustomerDto) => {
    setDeletingCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingCustomer) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCustomer) {
      await deleteMutation.mutateAsync(deletingCustomer.id);
      setIsDeleteDialogOpen(false);
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
          <h1 className="text-3xl font-semibold text-white tracking-tight">Customers</h1>
          <p className="mt-2 text-sm text-slate-400 font-light">
            Manage your customer database and interaction history.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 h-[clamp(3rem,2.8rem+1vw,3.25rem)] text-base font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 transition-colors w-full sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Customer
          </motion.button>
        </div>
      </div>

      <div className="premium-card p-4 sm:p-6 mb-6">
        <CustomerFilters onSearch={handleSearch} initialSearchTerm={searchTerm} />
      </div>

      <div className="premium-card overflow-hidden">
        <CustomerTable
          data={data?.items || []}
          isLoading={isLoading}
          pageNumber={data?.pageNumber || 1}
          totalPages={data?.totalPages || 1}
          onPageChange={setPageNumber}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Form Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsFormOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[#0A0A0A] rounded-[24px] shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto border border-white/[0.08]"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </h3>
            <CustomerForm
              initialData={editingCustomer}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteCustomerDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={deleteMutation.isPending}
        customerName={deletingCustomer?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </motion.div>
  );
};
