import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          className={cn(
            'bg-zinc-900 rounded-lg w-full max-w-md',
            className
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            {title && (
              <Dialog.Title className="text-lg font-semibold text-white">
                {title}
              </Dialog.Title>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}