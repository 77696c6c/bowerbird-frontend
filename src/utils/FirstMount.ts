import { useRef, useEffect } from 'react';

export const useFirstMount = () => {
  const firstMountRef = useRef(true);
  useEffect(() => {
    firstMountRef.current = false;
  }, []);
  return firstMountRef.current;
};
