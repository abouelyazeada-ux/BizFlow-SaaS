import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema, type InvoiceFormValues } from '../schemas/invoiceSchema';
import { useCreateInvoice } from '../hooks/useInvoiceMutations';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { useProducts } from '../../products/hooks/useProducts';
import { InvoiceSummary } from '../components/InvoiceSummary';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';

export const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateInvoice();
  
  // Fetch dropdown data
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({ pageNumber: 1, pageSize: 100 });
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ pageNumber: 1, pageSize: 100, stockStatus: 'InStock' });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      discount: 0,
      tax: 0,
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch fields for calculations
  const items = useWatch({ control, name: 'items' });
  const discount = useWatch({ control, name: 'discount' }) || 0;
  const tax = useWatch({ control, name: 'tax' }) || 0;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const total = subtotal - discount + tax;

  const handleProductSelect = (index: number, productId: string) => {
    const product = productsData?.items.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <Link to="/invoices" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Invoices
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Customer Selection */}
        <div className="premium-card p-6">
          <h3 className="text-lg font-medium text-white mb-4 border-b border-white/[0.08] pb-2">Customer Details</h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Customer <span className="text-rose-500">*</span></label>
            <select
              {...register('customerId')}
              className="block w-full rounded-md border border-white/[0.1] bg-white/[0.03] py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white sm:text-sm shadow-sm"
              disabled={isLoadingCustomers}
            >
              <option value="" className="bg-[#121212] text-white">-- Choose a customer --</option>
              {customersData?.items.map((customer) => (
                <option key={customer.id} value={customer.id} className="bg-[#121212] text-white">{customer.name} ({customer.email})</option>
              ))}
            </select>
            {errors.customerId && <p className="mt-1 text-sm text-rose-400">{errors.customerId.message}</p>}
          </div>
        </div>

        {/* Line Items */}
        <div className="premium-card overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] flex justify-between items-center">
            <h3 className="text-base font-semibold leading-6 text-white">Line Items</h3>
            <button
              type="button"
              onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
              className="inline-flex items-center rounded-lg bg-white/[0.03] px-3 py-1.5 text-sm font-medium text-white shadow-sm border border-white/[0.1] hover:bg-white/[0.06] transition-colors"
            >
              <Plus className="-ml-0.5 mr-1 h-4 w-4 text-slate-400" />
              Add Item
            </button>
          </div>
          
          <div className="px-6 py-5 space-y-4">
            {errors.items?.root && <p className="text-sm text-rose-400 mb-2">{errors.items.root.message}</p>}
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white/[0.02] p-4 rounded-lg border border-white/[0.08]">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product <span className="text-rose-500">*</span></label>
                  <select
                    {...register(`items.${index}.productId` as const)}
                    onChange={(e) => {
                      register(`items.${index}.productId`).onChange(e);
                      handleProductSelect(index, e.target.value);
                    }}
                    className="block w-full rounded-md border border-white/[0.1] bg-white/[0.03] text-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    disabled={isLoadingProducts}
                  >
                    <option value="" className="bg-[#121212] text-white">-- Select --</option>
                    {productsData?.items.map((product) => (
                      <option key={product.id} value={product.id} className="bg-[#121212] text-white">{product.name} (Stock: {product.quantity})</option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && <p className="mt-1 text-xs text-rose-400">{errors.items[index]?.productId?.message}</p>}
                </div>
                
                <div className="w-full sm:w-24">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Qty</label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="block w-full rounded-md border border-white/[0.1] bg-white/[0.03] text-white py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                  {errors.items?.[index]?.quantity && <p className="mt-1 text-xs text-rose-400">{errors.items[index]?.quantity?.message}</p>}
                </div>

                <div className="w-full sm:w-32">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Price</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                      <span className="text-slate-400 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                      className="block w-full rounded-md border border-white/[0.1] bg-white/[0.03] text-white py-2 pl-6 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-32">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Total</label>
                  <div className="py-2 text-sm font-medium text-white">
                    ${((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)).toFixed(2)}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-6 border-t border-white/[0.08] bg-transparent flex flex-col md:flex-row justify-between gap-6">
            <div className="w-full max-w-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Discount</label>
                <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('discount', { valueAsNumber: true })}
                    className="block w-full pl-7 px-3 py-2 border border-white/[0.1] bg-white/[0.03] text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Tax</label>
                <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('tax', { valueAsNumber: true })}
                    className="block w-full pl-7 px-3 py-2 border border-white/[0.1] bg-white/[0.03] text-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <InvoiceSummary 
              subtotal={subtotal} 
              discount={discount} 
              tax={tax} 
              total={total} 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-white/[0.08]">
          <Link
            to="/invoices"
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/[0.03] border border-white/[0.1] rounded-md hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 disabled:opacity-50 shadow-sm transition-colors"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};
