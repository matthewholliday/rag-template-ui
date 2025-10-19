import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="label" htmlFor={props.id}>{label}</label>}
        <input ref={ref} className={`input ${className}`.trim()} {...props} />
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
