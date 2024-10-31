import '../../styles/Loading.css'

const Loading = ({ isOpen }) => {

  if (!isOpen) return null;
  return (
    <div className="modal-overlay-load visible">
      <div className="modal-content-load">
        <div className="loading-content">
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