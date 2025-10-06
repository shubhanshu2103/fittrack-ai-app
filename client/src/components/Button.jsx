import React from 'react';
import clsx from 'clsx';

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={clsx(
      "w-full p-3 font-bold text-white rounded-full transition-all duration-300",
      "bg-cyan-600 hover:bg-cyan-500 active:scale-95",
      "disabled:bg-slate-600 disabled:cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);
export default Button;