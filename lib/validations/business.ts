import { z } from 'zod';

export const businessFormSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  logo: z.string().optional(),
  ownerImage: z.string().optional(),
  style: z.string().default('modern'),
  colorScheme: z.string().default('default'),
  font: z.string().default('inter'),
  layout: z.string().default('default'),
});

export type BusinessFormData = z.infer<typeof businessFormSchema>; 