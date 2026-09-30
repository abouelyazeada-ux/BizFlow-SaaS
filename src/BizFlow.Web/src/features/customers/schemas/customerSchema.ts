import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
