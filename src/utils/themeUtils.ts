
/**
 * Initializes theme colors based on the accent hue and theme mode
 */
export const initializeThemeColors = (accentH: number, isDark: boolean) => {
  const root = document.documentElement;
  const primaryColor = `${accentH} 81% ${isDark ? "56%" : "36%"}`;
  
  root.style.setProperty("--primary", primaryColor);
  root.style.setProperty("--accent", primaryColor);
  root.style.setProperty("--ring", primaryColor);
  root.style.setProperty("--foreground", `${accentH} 81% ${isDark ? "100%" : "26%"}`);
  
  // Set text color for buttons
  root.style.setProperty("--button-text-color", `${accentH} 81% ${isDark ? "100%" : "98%"}`);
};

/**
 * Creates the semi-circular gradient background effect from the bottom
 */
export const initializeSunriseGradient = (accentH: number, opacity: number, isDark: boolean) => {
  let gradientElement = document.getElementById('sunrise-gradient');
  if (!gradientElement) {
    gradientElement = document.createElement('div');
    gradientElement.id = 'sunrise-gradient';
    gradientElement.style.position = 'fixed';
    gradientElement.style.bottom = '0';
    gradientElement.style.left = '50%';
    gradientElement.style.transform = 'translateX(-50%)';
    gradientElement.style.width = '200vw';
    gradientElement.style.height = '100vh';
    gradientElement.style.pointerEvents = 'none';
    gradientElement.style.zIndex = '-10';
    document.body.insertBefore(gradientElement, document.body.firstChild);
  }
  
  const hue = accentH;
  const saturation = '81%';
  const lightness = isDark ? '56%' : '36%';
  gradientElement.style.background = `radial-gradient(ellipse at 50% 100%, hsla(${hue}, ${saturation}, ${lightness}, ${opacity / 100}) 0%, transparent 70%)`;
  gradientElement.style.display = 'block';
};

/**
 * Creates or retrieves the background element
 */
export const createBackgroundElement = () => {
  let backgroundElement = document.getElementById('app-background');
  if (!backgroundElement) {
    backgroundElement = document.createElement('div');
    backgroundElement.id = 'app-background';
    backgroundElement.style.position = 'fixed';
    backgroundElement.style.top = '0';
    backgroundElement.style.left = '0';
    backgroundElement.style.width = '100%';
    backgroundElement.style.height = '100%';
    backgroundElement.style.zIndex = '-15'; // Lower z-index to be behind gradient
    backgroundElement.style.pointerEvents = 'none';
    backgroundElement.style.transition = 'opacity 0.3s ease';
    document.body.insertBefore(backgroundElement, document.body.firstChild);
  }
  return backgroundElement;
};
