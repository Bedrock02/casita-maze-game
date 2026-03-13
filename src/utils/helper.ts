/**
 * Device detection utilities
 */

export const checkDevice = (): boolean => {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       window.innerWidth <= 768;
  return isMobileDevice;
};

export const addDeviceResizeListener = (callback: (isMobile: boolean) => void) => {
  // Set initial value
  callback(checkDevice());
  
  const handleResize = () => {
    callback(checkDevice());
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
};
