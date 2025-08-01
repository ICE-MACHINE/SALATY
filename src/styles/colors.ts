export const colors = {
  lightBackground: '#555555aa',
  darkBackground: '#33333355',
  
  lightModalBackground: '#fff',
  darkModalBackground: '#333',
  
  lightText: '#000',
  darkText: '#fff',
  
  primary: '#4CAF50',
} as const;

export const getBackgroundColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkBackground : colors.lightBackground;

export const getModalBackgroundColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkModalBackground : colors.lightModalBackground;

export const getTextColor = (mode: 'light' | 'dark') => 
  mode === 'dark' ? colors.darkText : colors.lightText;
