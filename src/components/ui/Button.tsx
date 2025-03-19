import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
