import React, { useState } from 'react';

import '../../styles/Loading.css'
import PulseLoader from "react-spinners/PulseLoader";

const Loading = ({ isOpen }) => {
  let [color, setColor] = useState("#6A39C0");

  if (!isOpen) return null;
  return (
    <div className="modal-overlay-load">
      <div className="modal-content-load">
        <PulseLoader
          color={color}
          size={20}
          loading={isOpen}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Loading;