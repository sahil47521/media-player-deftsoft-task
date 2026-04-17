import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/variables';

interface CardWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  style
}) => {
  return (
    <View style={[styles.shadowContainer, style]}>
      <View style={styles.clippingContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: 'transparent',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 3,
  },
  clippingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden', // This clips the children (like headers)
  },
});

export default CardWrapper;
