import React from 'react';
import { ErrorBoundary } from './utils/errorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import AppRoutes from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ToastProvider />
        <AppRoutes />
      </QueryProvider>
    </ErrorBoundary>
  );
}