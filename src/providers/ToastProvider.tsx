import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgb(24 24 27)',
          color: '#fff',
          border: '1px solid rgb(63 63 70)'
        }
      }}
    />
  );
}