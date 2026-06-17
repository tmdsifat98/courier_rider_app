import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const IconBox: React.FC<IconProps> = ({ size = 24, color = "#4F46E5" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05" />
    <Path d="M12 22.08V12" />
  </Svg>
);

export const IconWallet: React.FC<IconProps> = ({ size = 24, color = "#4F46E5" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <Path d="M12 11h4v2h-4z" />
    <Path d="M16 8V6a2 2 0 0 0-2-2H4" />
  </Svg>
);

export const IconSwap: React.FC<IconProps> = ({ size = 24, color = "#4F46E5" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 3L21 7L17 11" />
    <Path d="M3 7H21" />
    <Path d="M7 21L3 17L7 13" />
    <Path d="M21 17H3" />
  </Svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 20, color = "#10B981" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

export const IconX: React.FC<IconProps> = ({ size = 20, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M15 9l-6 6M9 9l6 6" />
  </Svg>
);

export const IconClock: React.FC<IconProps> = ({ size = 20, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);