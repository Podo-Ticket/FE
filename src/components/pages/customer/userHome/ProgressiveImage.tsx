import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  lowResSrc: string;
  highResSrc: string;
}

const Poster = styled.img`
  position: relative;
  height: 69%;
  width: auto;
  object-fit: cover;
  object-position: top;
  z-index: 0;
  border-radius: 20px 20px 0 0;
  border-bottom: 2px dashed var(--grey-5);
`;

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  lowResSrc,
  highResSrc,
  alt = "",
  style,
  ...rest
}) => {
  const [src, setSrc] = useState<string>(lowResSrc);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSrc(lowResSrc);
    setLoading(true);
    const img = new window.Image();
    img.src = highResSrc;
    img.onload = () => {
      setSrc(highResSrc);
      setLoading(false);
    };
  }, [lowResSrc, highResSrc]);

  return (
    <Poster
      src={src}
      alt={alt}
      style={{
        transition: "filter 0.3s ease",
        filter: loading ? "blur(3px) grayscale(50%)" : "none",
        ...style,
      }}
      {...rest}
    />
  );
};

export default ProgressiveImage;