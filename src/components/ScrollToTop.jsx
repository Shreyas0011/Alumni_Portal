import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Every page change starts at the top. `behavior: 'instant'` overrides the
// global `scroll-behavior: smooth`, so the new page doesn't visibly scroll up.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
