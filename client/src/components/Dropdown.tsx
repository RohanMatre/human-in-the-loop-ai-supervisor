import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface DropdownItem {
  id: string | number;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: number | string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';
  const widthStyle = typeof width === 'number' ? { width: `${width}px` } : { width };
  
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={`absolute z-30 mt-2 ${alignmentClasses} rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in`}
          style={widthStyle}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-menu"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.divider ? (
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                ) : (
                  <button
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                        closeDropdown();
                      }
                    }}
                    className={`${
                      item.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${
                      item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'
                    } group flex items-center w-full px-4 py-2 text-sm`}
                    role="menuitem"
                    disabled={item.disabled}
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown; 