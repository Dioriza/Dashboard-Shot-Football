import React from 'react';
import { DIMENSIONS, THEME } from '../lib/constants';

const { length, width } = DIMENSIONS.pitch;
const scale = 10; // Increased scale for half pitch visibility

export const Pitch = ({ children }: { children?: React.ReactNode }) => {
  // We strictly render the attacking half (Half-Pitch)
  // Standard Pitch Length 105m -> Half is 52.5m
  // We want to render 52.5m x 68m box
  const halfLength = length / 2;

  return (
    <div className="relative overflow-visible border border-gray-200 rounded theme-transition mx-auto"
      style={{ width: `${halfLength * scale}px`, height: `${width * scale}px`, backgroundColor: THEME.colors.pitch.grass }}>

      {/* ViewBox: Show only right half (52.5 to 105) for "Attacking View" */}
      {/* Or standard left half (0 to 52.5) and flip data? */}
      {/* Let's show Standard Horizontal: 0 to 105. But crop to 52.5-105 */}
      {/* Actually, user wants "relevant attacking half". ShotMap usually normalizes all shots to one goal. */}
      {/* So we render a single half (0-52.5 or 0-60) and assume data is normalized to it. */}

      <svg width="100%" height="100%" viewBox={`0 0 ${halfLength} ${width}`}>
        {/* Outline (Half Pitch) */}
        <rect x="0" y="0" width={halfLength} height={width} fill="none" stroke={THEME.colors.pitch.lines} strokeWidth="0.5" />

        {/* Penalty Area (Left only, representing attacking goal for normalized shots) */}
        <g id="penalty-area">
          <rect x="0" y={(width / 2) - 20.16} width="16.5" height="40.32" fill="none" stroke={THEME.colors.pitch.lines} strokeWidth="0.5" />
          <rect x="0" y={(width / 2) - 9.16} width="5.5" height="18.32" fill="none" stroke={THEME.colors.pitch.lines} strokeWidth="0.5" />
          <circle cx="11" cy={width / 2} r="0.5" fill={THEME.colors.pitch.lines} />
          {/* Penalty Arc */}
          <path d="M 16.5 28.84 A 9.15 9.15 0 0 1 16.5 39.16" stroke={THEME.colors.pitch.lines} strokeWidth="0.5" fill="none" />
        </g>

        {/* Center Circle (Half) */}
        <path d={`M ${halfLength} ${(width / 2) - 9.15} A 9.15 9.15 0 0 0 ${halfLength} ${(width / 2) + 9.15}`} stroke={THEME.colors.pitch.lines} strokeWidth="0.5" fill="none" />

        {/* Goal */}
        <g id="goal">
          <rect x="-2" y={(width / 2) - 3.66} width="2" height="7.32" fill="none" stroke={THEME.colors.pitch.goals} strokeWidth="0.5" />
        </g>

        {/* Children (Shot Layers etc) */}
        {children}
      </svg>
    </div>
  );
};
