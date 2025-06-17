import { useState } from "react";
import "./ShopInput.scss";

export interface ShopInputProps {
  labelText: string;
  dataType?: string;
  elementType?: string;
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  dropdownOptions?: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

const ShopInput = (props: ShopInputProps) => {
  let inputElement = null;
  const {
    labelText,
    elementType,
    placeholder,
    dataType,
    onChange,
    dropdownOptions = [],
    disabled,
  } = props;

  const [inputValue, setInputValue] = useState(props.value || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
    setShowDropdown(e.target.value !== "");
    onChange?.(e);
  };

  const handleDropdownSelect = (value: string) => {
    setInputValue(value);
    onChange?.({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowDropdown(false); // close dropdown on select
  };

  switch (elementType) {
    case "input":
      inputElement = (
        <div className="shopInput">
          <label className="shopInput__label">{labelText}</label>
          <input
            className="shopInput__input"
            type={dataType || "text"}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      );
      break;

    case "quantity":
      inputElement = (
        <div className="shopInput">
          <label className="shopInput__label">{labelText}</label>
          <input
            className="shopInput__input"
            type="number"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      );
      break;

    case "dropdown":
      inputElement = (
        <div className="shopInput" style={{ position: "relative" }}>
          <label className="shopInput__label">{labelText}</label>
          <input
            className="shopInput__input"
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
          />

          {inputValue && dropdownOptions.length && showDropdown && (
            <div className="dropdown-container">
              {dropdownOptions.map((option) => (
                <div
                  key={option.value}
                  className="dropdown-item"
                  onClick={() => handleDropdownSelect(option.value)}
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
        <div className="shopInput">
          <label className="shopInput__label">Invalid Input Type</label>
        </div>
      );
  }

  return inputElement;
};

export default ShopInput;
