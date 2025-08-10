import React from 'react';
import './ShopButton.scss';

type ShopButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

const ShopButton: React.FC<ShopButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button
      className={`shop-button${disabled ? ' disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default ShopButton;
