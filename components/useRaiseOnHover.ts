import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useRaiseOnHover = () => {
  const lift = useRef(new Animated.Value(0)).current;
  const [raised, setRaised] = useState(false);

  const handleHoverIn = () => {
    setRaised(true);
    Animated.spring(lift, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  };

  const handleHoverOut = () => {
    setRaised(false);
    Animated.spring(lift, {
      toValue: 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 4,
    }).start();
  };

  const translateY = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });

  return { translateY, handleHoverIn, handleHoverOut, zIndex: raised ? 4 : 0 };
};
