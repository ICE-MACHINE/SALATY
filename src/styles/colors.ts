export const colors = {
  lightBackground: '#55555555',
  darkBackground: '#33333355',
  
  lightModalBackground: '#fff',
  darkModalBackground: '#333',
  
  lightText: '#000',
  darkText: '#fff',
  
  primary: '#007bff',
} as const;

export const getBackgroundColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkBackground : colors.lightBackground;

export const getModalBackgroundColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkModalBackground : colors.lightModalBackground;

export const getTextColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkText : colors.lightText;
