import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validators) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    if (!validators[name]) return true;

    const fieldValidators = Array.isArray(validators[name])
      ? validators[name]
      : [validators[name]];

    for (const validator of fieldValidators) {
      const validation = typeof validator === 'function'
        ? validator(value, values)
        : validator;

      const isValid = validation.isValid;
      const message = validation.message || '';

      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: message
        }));
        return false;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    return true;
  }, [validators, values]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validate if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  }, [values, validateField]);

  const validateAll = useCallback(() => {
    const fieldsToValidate = Object.keys(validators);
    let isValid = true;
    const newTouched = {};

    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      if (!validateField(field, values[field])) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    return isValid;
  }, [validators, values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const isValid = Object.values(errors).every(error => !error);
  const hasErrors = Object.values(errors).some(error => error);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    hasErrors,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    reset,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setIsSubmitting,
    setValues,
    setErrors,
    setTouched
  };
};

export default useFormValidation;
