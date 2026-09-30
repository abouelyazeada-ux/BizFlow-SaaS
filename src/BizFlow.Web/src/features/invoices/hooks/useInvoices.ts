import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../../../services/invoiceService';

export const useInvoices = (params: { pageNumber: number; pageSize: number; searchTerm?: string; status?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoiceService.getInvoices(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getInvoice(id),
    enabled: !!id,
  });
};
