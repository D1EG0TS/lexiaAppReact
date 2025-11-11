import React from 'react';
import { ScrollView, Platform, ScrollViewProps } from 'react-native';

export interface ScrollContainerProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator,
  ...rest
}) => {
  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[{ flexGrow: 1, paddingBottom: 16 }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        typeof showsVerticalScrollIndicator === 'boolean'
          ? showsVerticalScrollIndicator
          : Platform.OS === 'web'
      }
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

export default ScrollContainer;