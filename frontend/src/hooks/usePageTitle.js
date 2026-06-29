import { useEffect } from 'react';

export const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `ESO | ${title}` : 'ESO';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
