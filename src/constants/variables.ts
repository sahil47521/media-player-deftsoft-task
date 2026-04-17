import { Dimensions } from 'react-native';

const { width: DW, height: DH } = Dimensions.get('window');

export const COLORS = {
  primary: '#007bff',
  success: '#10b981',
  danger: '#ff4444',
  warning: '#ffc107',
  
  background: '#f8f9fa',
  white: '#ffffff',
  
  border: '#e9ecef',
  divider: '#f1f1f1',
  
  textMain: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  textMuted: '#adb5bd',
  
  cardHeader: '#f8f9fa',
  badge: '#000000',
};

export { DW, DH };
