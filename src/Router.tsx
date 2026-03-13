import { useEffect, useState } from 'react';
import App from './App';
import Play from './play';
import Instructions from './instructions';

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

  if (pathname === '/instructions') {
    return <Instructions onStart={() => navigate('/play')} />;
  }

  return <App onStart={() => navigate('/instructions')} />;
}

export default Router;