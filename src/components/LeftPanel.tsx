import { useNavigate } from 'react-router-dom';
import './LeftPanel.scss';

const iconColor = '#E0E6ED'; // lighter gray for better contrast
const iconSize = 32;

const HomeIcon = ({ color }: { color: string }) => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M3 11.5L12 4L21 11.5'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <rect
      x='6.5'
      y='12'
      width='11'
      height='7.5'
      rx='2'
      stroke={color}
      strokeWidth='2'
    />
  </svg>
);

const BillingIcon = ({ color }: { color: string }) => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect
      x='4'
      y='4'
      width='16'
      height='16'
      rx='3'
      stroke={color}
      strokeWidth='2'
    />
    <path
      d='M8 8H16M8 12H16M8 16H12'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

const InventoryIcon = ({ color }: { color: string }) => (
  <svg
    width={iconSize}
    height={iconSize}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect
      x='3'
      y='7'
      width='18'
      height='13'
      rx='2'
      stroke={color}
      strokeWidth='2'
    />
    <path
      d='M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2'
      stroke={color}
      strokeWidth='2'
    />
    <rect
      x='9'
      y='12'
      width='6'
      height='4'
      rx='1'
      stroke={color}
      strokeWidth='2'
    />
  </svg>
);

const LeftPanel = () => {
  const navigate = useNavigate();

  return (
    <div className='leftPanel'>
      <div
        className='leftPanel__home leftPanel__item'
        onClick={() => navigate('/')}
      >
        <HomeIcon color={iconColor} />
        <span className='leftPanel__label'>Home</span>
      </div>
      <div
        className='leftPanel__billing leftPanel__item'
        onClick={() => navigate('/billing')}
      >
        <BillingIcon color={iconColor} />
        <span className='leftPanel__label'>Billing</span>
      </div>
      <div
        className='leftPanel__inventory leftPanel__item'
        onClick={() => navigate('/inventory')}
      >
        <InventoryIcon color={iconColor} />
        <span className='leftPanel__label'>Inventory</span>
      </div>
    </div>
  );
};

export default LeftPanel;
