import { useEffect, useState } from 'react';
import App from './App';
import Play from './play';

function Router() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path === pathname) {
      return;
    }
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  if (pathname === '/play') {
    return <Play />;
  }

  return <App onStart={() => navigate('/play')} />;
}

export default Router;