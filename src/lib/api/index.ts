export * from './client';
export * from './queries';

// Re-export commonly used hooks with better names
export { useSupabaseQuery as useQuery } from './queries';
export { useSupabaseMutation as useMutation } from './queries';