import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-button",
    secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500 shadow-teal-button",
    tertiary: "bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500 shadow-purple-button",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  };
  
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// Card component for consistent container styling
interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-card border border-gray-200/50 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// Card sections
export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200/50 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200/50 bg-gray-50/50 ${className}`}>
      {children}
    </div>
  );
};

// Input component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = `px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-1 
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}
    ${fullWidth ? 'w-full' : ''}
    ${className}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Badge component
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-teal-100 text-teal-800',
    tertiary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Avatar component
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  initials,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  if (src) {
    return (
      <div className={`relative rounded-full overflow-hidden bg-gray-100 ${sizeClasses[size]} ${className}`}>
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      </div>
    );
  }

  // Display initials if no image
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium ${sizeClasses[size]} ${className}`}>
      {initials || alt.charAt(0).toUpperCase()}
    </div>
  );
};

// Section heading
interface HeadingProps {
  children: ReactNode;
  subheading?: ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<HeadingProps> = ({
  children,
  subheading,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900">{children}</h2>
      {subheading && (
        <p className="mt-1 text-sm text-gray-500">{subheading}</p>
      )}
    </div>
  );
};

// Simple divider
export const Divider: React.FC<{className?: string}> = ({className = ''}) => {
  return <div className={`h-px w-full bg-gray-200 my-4 ${className}`}></div>;
}; 