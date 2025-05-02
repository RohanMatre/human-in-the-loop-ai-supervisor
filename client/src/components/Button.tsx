import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none transition-all duration-200 ease-in-out';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    secondary: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50',
    success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-opacity-50',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
    warning: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white shadow-sm focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-30',
    link: 'bg-transparent p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:ring-0',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const disabledClasses = disabled || isLoading 
    ? 'opacity-60 cursor-not-allowed dark:opacity-50' 
    : 'transform hover:-translate-y-0.5 active:translate-y-0';

  const iconClasses = icon && !isLoading ? (
    iconPosition === 'left' ? 'mr-2' : 'ml-2 order-2'
  ) : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${widthClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className={iconClasses}>{icon}</span>
      ) : null}
      
      <span className={icon && iconPosition === 'right' ? 'order-1' : ''}>{children}</span>
      
      {!isLoading && icon && iconPosition === 'right' ? (
        <span className={iconClasses}>{icon}</span>
      ) : null}
    </button>
  );
};

export default Button; 