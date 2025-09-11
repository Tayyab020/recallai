import React from 'react';
import { TextField } from '@mui/material';

const ValidatedTextField = ({
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  helperText,
  showCharCount = false,
  maxLength,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(name);
    }
  };

  const getHelperText = () => {
    if (touched && error) {
      return error;
    }
    
    if (showCharCount && maxLength) {
      const charCount = `${value?.length || 0}/${maxLength} characters`;
      return helperText ? `${helperText} (${charCount})` : charCount;
    }
    
    return helperText;
  };

  return (
    <TextField
      {...props}
      name={name}
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched && !!error}
      helperText={getHelperText()}
    />
  );
};

export default ValidatedTextField;