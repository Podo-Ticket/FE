import { useState, useEffect } from 'react';
import '../css/loading.css'

const Loading = ({ isOpen }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
      }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay visible">
      <div className="modal-content">
        <div className="loading-content">
          <div className="loading-text">예매내역 확인 중</div>
          <div className="dots-container">
            <span className="dot" style={{'--delay': '0s'}}></span>
            <span className="dot" style={{'--delay': '0.2s'}}></span>
            <span className="dot" style={{'--delay': '0.4s'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;