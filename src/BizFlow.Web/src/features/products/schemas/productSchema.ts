import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  categoryId: z.string().uuid('Please select a valid category').optional().nullable(),
  price: z.number().min(0.01, 'Price must be greater than zero'),
  costPrice: z.number().min(0, 'Cost price cannot be negative'),
  minimumStockLevel: z.number().int().min(0, 'Minimum stock cannot be negative'),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
