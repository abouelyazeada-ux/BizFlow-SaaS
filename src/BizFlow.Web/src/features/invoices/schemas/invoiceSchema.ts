import { z } from 'zod';

export const invoiceItemSchema = z.object({
  productId: z.string().uuid('Please select a valid product'),
  productName: z.string().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
});

export const invoiceSchema = z.object({
  customerId: z.string().uuid('Please select a valid customer'),
  discount: z.number().min(0, 'Discount cannot be negative'),
  tax: z.number().min(0, 'Tax cannot be negative'),
  items: z.array(invoiceItemSchema).min(1, 'Invoice must have at least one item'),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceItemFormValues = z.infer<typeof invoiceItemSchema>;
