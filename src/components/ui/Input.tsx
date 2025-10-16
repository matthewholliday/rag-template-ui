import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="label" htmlFor={props.id}>{label}</label>}
      <input className={`input ${className}`.trim()} {...props} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;
