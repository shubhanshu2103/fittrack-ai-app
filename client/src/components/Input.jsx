import React from 'react';

const Input = (props) => (
  <input
    {...props}
    className="w-full p-3 bg-slate-800 text-white rounded-lg border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 placeholder:text-slate-500"
  />
);
export default Input;