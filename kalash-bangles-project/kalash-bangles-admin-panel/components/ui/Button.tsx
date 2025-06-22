import React, { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

// Props specific to our Button, not from the underlying element
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string;
  children?: ReactNode;
  className?: string; // Add className here to avoid conflict
}

// Combine ButtonOwnProps with props of the 'as' component
// C defaults to 'button'
export type ButtonProps<C extends ElementType = 'button'> = {
  as?: C;
} & ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | 'as' | 'className'>;

const Button = <C extends ElementType = 'button',>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  className: propClassName = '', // Renamed from className to propClassName
  isLoading = false,
  icon,
  ...restProps
}: ButtonProps<C>) => {
  const ComponentToRender = as || 'button';

  const baseStyle = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${propClassName}`;
  
  const finalProps: Record<string, any> = {
    className: combinedClassName,
    ...restProps,
  };

  // Handle 'disabled' attribute specifically for button elements
  if (ComponentToRender === 'button') {
    finalProps.disabled = isLoading || (restProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled;
  } else if (isLoading) {
    // For non-button components, if isLoading, we might want to prevent interaction.
    // However, 'disabled' attribute is not standard for all elements (e.g., <a>).
    // The className 'disabled:opacity-50 disabled:cursor-not-allowed' might apply if component handles 'disabled' state.
    // If the 'as' component (like Link) has its own 'disabled' or similar prop, it should be in restProps.
  }


  return (
    <ComponentToRender {...finalProps}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        icon && <i className={`${icon} mr-2`}></i>
      )}
      {children}
    </ComponentToRender>
  );
};

export default Button;