import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll hacia arriba cada vez que cambie la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Para una transición suave
    });
  }, [pathname]);

  return null; // Este componente no renderiza nada
};

export default ScrollToTop;