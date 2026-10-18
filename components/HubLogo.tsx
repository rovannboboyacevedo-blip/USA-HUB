import Svg, { Line, Path, Rect } from 'react-native-svg';

import { colors } from '@/constants/theme';

type HubLogoProps = {
  width?: number;
};

const HubLogo = ({ width = 110 }: HubLogoProps) => {
  const height = width / 2;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 50"
      accessibilityRole="image"
      accessibilityLabel="USA Hub mark"
    >
      <Rect x="5" y="5" width="90" height="40" rx="20" fill="none" stroke={colors.text} strokeWidth="3" />
      <Line x1="5" y1="25" x2="95" y2="25" stroke={colors.text} strokeWidth="2" />
      <Line x1="5" y1="15" x2="95" y2="15" stroke={colors.text} strokeWidth="1.5" strokeDasharray="1 1" />
      <Line x1="5" y1="35" x2="95" y2="35" stroke={colors.text} strokeWidth="1.5" strokeDasharray="1 1" />
      <Path d="M 25 5 Q 35 25 25 45" fill="none" stroke={colors.text} strokeWidth="2" />
      <Path d="M 75 5 Q 65 25 75 45" fill="none" stroke={colors.text} strokeWidth="2" />
      <Path d="M 50 5 L 50 45" fill="none" stroke={colors.text} strokeWidth="2" />
    </Svg>
  );
};

export default HubLogo;
