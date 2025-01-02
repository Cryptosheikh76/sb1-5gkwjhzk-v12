import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ZodSchema } from 'zod';

export function useZodForm<T extends ZodSchema>(schema: T) {
  return useForm({
    resolver: zodResolver(schema)
  });
}