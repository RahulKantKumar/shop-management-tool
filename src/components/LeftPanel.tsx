import { useNavigate } from 'react-router-dom';
import './LeftPanel.scss';

const LeftPanel = () => {
  const navigate = useNavigate();

  return (
    <div className='leftPanel'>
      <div className='leftPanel__home' onClick={() => navigate('/')}></div>
      <div
        className='leftPanel__billing'
        onClick={() => navigate('/billing')}
      ></div>
    </div>
  );
};

export default LeftPanel;
