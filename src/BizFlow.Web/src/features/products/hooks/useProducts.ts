import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/productService';

export const useProducts = (params: { pageNumber: number; pageSize: number; searchTerm?: string; stockStatus?: string }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};
