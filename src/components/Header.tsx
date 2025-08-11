import './Header.scss';
import Logo from '../assets/Logo.png';

const Header = () => {
  return (
    <div className='header'>
      <img src={Logo} alt='Logo' className='header__logo' style={{ height: 48, marginRight: 16 }} />
      <div className='header__title'>DEV ELECTRICALS</div>
    </div>
  );
};

export default Header;
