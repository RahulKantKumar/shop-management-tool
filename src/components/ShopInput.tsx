import { useState, useEffect, useId } from 'react';
import './ShopInput.scss';

export interface ShopInputProps {
  labelText: string;
  dataType?: string;
  elementType?: string;
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  dropdownOptions?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  maxLength?: number;
  onDropdownSelect?: (selectedValue: string) => void;
}

const ShopInput = (props: ShopInputProps) => {
  const {
    labelText,
    elementType,
    placeholder,
    dataType,
    onChange,
    dropdownOptions = [],
    disabled,
    maxLength,
    value,
  } = props;

  const [inputValue, setInputValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputId = useId();

  // Sync inputValue with value prop
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    if (dataType === 'mobile') {
      // Remove non-digits and limit to 10 digits
      let numericValue = val.replace(/[^0-9]/g, '').slice(0, 10);
      // Optionally, only allow starting with 6-9
      if (numericValue && !/^[6-9]/.test(numericValue)) {
        numericValue = '';
      }
      setInputValue(numericValue);
      // Create a synthetic event with the cleaned value for parent
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: numericValue },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
      setShowDropdown(numericValue !== '');
    } else {
      setInputValue(val);
      setShowDropdown(val !== '');
      onChange?.(e);
    }
  };

  const handleDropdownSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    // Create a synthetic event for onChange
    if (onChange) {
      const syntheticEvent = {
        target: { value: selectedValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    setShowDropdown(false);
    // Call parent handler if provided
    props.onDropdownSelect?.(selectedValue);
  };

  let inputElement = null;

  switch (elementType) {
    case 'input':
      inputElement = (
        <div className='shopInput'>
          <label className='shopInput__label' htmlFor={inputId}>
            {labelText}
          </label>
          <input
            id={inputId}
            className='shopInput__input'
            type={dataType || 'text'}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
          />
        </div>
      );
      break;

    case 'quantity':
      inputElement = (
        <div className='shopInput'>
          <label className='shopInput__label' htmlFor={inputId}>
            {labelText}
          </label>
          <input
            id={inputId}
            className='shopInput__input'
            type={dataType === 'mobile' ? 'tel' : 'number'}
            value={inputValue}
            min={0}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            // maxLength is ignored for type="number" in most browsers
            // maxLength={maxLength}
          />
        </div>
      );
      break;

    case 'dropdown':
      inputElement = (
        <div className='shopInput' style={{ position: 'relative' }}>
          <label className='shopInput__label' htmlFor={inputId}>
            {labelText}
          </label>
          <input
            id={inputId}
            className='shopInput__input'
            type='text'
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete='off'
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {inputValue && dropdownOptions.length > 0 && showDropdown && (
            <div className='dropdown-container'>
              {dropdownOptions.map((option) => (
                <div
                  key={option.value}
                  className='dropdown-item'
                  onMouseDown={() => handleDropdownSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      );
      break;

    default:
      inputElement = (
        <div className='shopInput'>
          <label className='shopInput__label'>Invalid Input Type</label>
        </div>
      );
  }

  return inputElement;
};

export default ShopInput;
