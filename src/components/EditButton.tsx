import React from 'react';
import './EditButton.scss';

type EditButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
};

const EditButton: React.FC<EditButtonProps> = ({ onClick, disabled = false, title = 'Edit' }) => {
  return (
    <button
      className={`icon-button${disabled ? ' disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      title={title}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 20h9' />
        <path d='M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z' />
      </svg>
    </button>
  );
};

export default EditButton;


