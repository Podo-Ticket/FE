import {useEffect, PropsWithChildren} from 'react';

export default function ScrollLockWrapper({children}: PropsWithChildren<{}>) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);
  return <>{children}</>;
}
