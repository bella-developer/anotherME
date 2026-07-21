import { createContext, useContext, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    console.log('[ThemeContext] Initial theme from localStorage:', saved || 'dark');
    return saved || 'dark';
  });

  useLayoutEffect(() => {
    console.log('[ThemeContext] useLayoutEffect running, theme:', theme);
    console.log('[ThemeContext] Body classList BEFORE:', document.body.classList.toString());
    
    localStorage.setItem('theme', theme);
    
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    
    console.log('[ThemeContext] Body classList AFTER:', document.body.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    console.log('[ThemeContext] toggleTheme called, current theme:', theme);
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('[ThemeContext] Setting new theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
