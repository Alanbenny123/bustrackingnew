import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}
    >
      <p className="text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
      >
        Try Again
      </button>
    </div>
  );
}
