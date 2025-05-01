import React, { Fragment, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Set up keyboard event listener for escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);
  
  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  // Don't render anything if modal is closed
  if (!isOpen) return null;
  
  // Portal modal to the end of the body to avoid z-index issues
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-slide-in-left overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// Default footer with cancel and confirm buttons
export const ModalFooter: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  danger?: boolean;
}> = ({
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  isLoading = false,
  danger = false,
}) => (
  <Fragment>
    <Button
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
    >
      {cancelText}
    </Button>
    <Button
      variant={danger ? 'danger' : 'primary'}
      onClick={onConfirm}
      isLoading={isLoading}
    >
      {confirmText}
    </Button>
  </Fragment>
);

export default Modal; 