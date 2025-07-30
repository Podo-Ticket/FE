import {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';

interface PosterUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

const PosterUploader = ({value, onChange}: PosterUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // 메모리 누수 방지
  }, [value]);

  return (
    <div>
      <PosterLabel>
        <Title className='Podo-Ticket-Body-B3'>
          포스터 등록 <Essential>&nbsp;*</Essential>
        </Title>
        <span className='Podo-Ticket-Body-B6'>등록시 수정, 삭제가 불가합니다</span>
      </PosterLabel>

      <PosterBox onClick={() => inputRef.current?.click()}>
        {previewUrl ? (
          <PreviewImage src={previewUrl} alt='poster' />
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M12 5V19M5 12H19'
              stroke='#9E9E9E'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        )}
      </PosterBox>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={e => onChange(e.target.files?.[0] || null)}
        style={{display: 'none'}}
      />
    </div>
  );
};

export default PosterUploader;

const PosterLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-contents: center;

  margin-bottom: 3.03svh;

  span {
    margin-left: 2.5vw;
    color: red;
    font-weight: 400;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
`;

const PosterBox = styled.div`
  width: 120px;
  height: 160px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const Essential = styled.p`
  color: var(--red-1);
`;
