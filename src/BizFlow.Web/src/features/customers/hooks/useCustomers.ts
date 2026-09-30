import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../../services/customerService';

export const useCustomers = (params: { pageNumber: number; pageSize: number; searchTerm?: string }) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new page
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
};
