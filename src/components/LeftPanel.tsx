import { NavLink } from 'react-router-dom';
import './LeftPanel.scss';

const ICON_SIZE = 32;

const HomeIcon = () => (
  <svg
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    focusable='false'
  >
    <path
      d='M3 11.5L12 4L21 11.5'
      stroke='currentColor'
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
      stroke='currentColor'
      strokeWidth='2'
    />
  </svg>
);

const BillingIcon = () => (
  <svg
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    focusable='false'
  >
    <rect x='4' y='4' width='16' height='16' rx='3' stroke='currentColor' strokeWidth='2' />
    <path d='M8 8H16M8 12H16M8 16H12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
);

const InventoryIcon = () => (
  <svg
    width={ICON_SIZE}
    height={ICON_SIZE}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    focusable='false'
  >
    {/* Single large isometric parcel box with solid faces */}
    <polygon points='12,3 20,7 12,11 4,7' fill='currentColor' fillOpacity='1' />
    <polygon points='4,7 12,11 12,21 4,17' fill='currentColor' fillOpacity='0.35' />
    <polygon points='20,7 12,11 12,21 20,17' fill='currentColor' fillOpacity='0.65' />
  </svg>
);

const LeftPanel = () => {
  return (
    <nav className='leftPanel' aria-label='Primary'>
      <ul className='leftPanel__list' role='list'>
        <li className='leftPanel__item'>
          <NavLink
            to='/'
            className={({ isActive }) => `leftPanel__link${isActive ? ' active' : ''}`}
            title='Home'
          >
            <HomeIcon />
            <span className='leftPanel__label'>Home</span>
          </NavLink>
        </li>
        <li className='leftPanel__item'>
          <NavLink
            to='/billing'
            className={({ isActive }) => `leftPanel__link${isActive ? ' active' : ''}`}
            title='Billing'
          >
            <BillingIcon />
            <span className='leftPanel__label'>Billing</span>
          </NavLink>
        </li>
        <li className='leftPanel__item'>
          <NavLink
            to='/inventory'
            className={({ isActive }) => `leftPanel__link${isActive ? ' active' : ''}`}
            title='Inventory'
          >
            <InventoryIcon />
            <span className='leftPanel__label'>Inventory</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default LeftPanel;
