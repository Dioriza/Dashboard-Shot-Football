import React from 'react';
import { motion } from 'framer-motion';
import { MatchEvent } from '../lib/parser';
import { getEventColor } from '../lib/utils';
import { DIMENSIONS } from '../lib/constants';

interface ShotMapProps {
    events: MatchEvent[];
    onHover?: (event: MatchEvent | null) => void;
}

export const ShotMap = ({ events, onHover }: ShotMapProps) => {
    return (
        <g className="shot-layer">
            {events.map((event) => {
                // Normalize to Attacking Half (Left-to-Right attacking logic 0->105)
                // If we render only 0-52.5 (Half pitch), we must ensure x is in that range.
                // Standard stats data usually has x=100 as goal line.
                // Our parser likely passes through raw x/y.
                // If x is 0-100:
                // We want to map it to the Half Pitch SVG 0-52.5.
                // Shots typically occur near 100 (if attacking right) or 0 (if attacking left).
                // "Field Tilt" implies we care about attacking Third.
                // Let's assume we want to visualize ALL shots relative to ONE goal.

                let x = (event.location.x / 100) * 105;
                let y = (event.location.y / 100) * 68;

                // Normalize: If x > 52.5 (Attacking Right), flip to Left for visualizing on single half
                // OR if we assume all shots in data are "Attacking", we map them to the goal at x=0 or x=52.5?
                // Visualizing on Left Goal (x=0 style):
                // If shot is at x=95 (near right goal), we map to x=10 (near left goal).
                // x' = 105 - x
                // y' = 68 - y (Flip y as well to maintain perspective)

                if (x > 52.5) {
                    x = 105 - x;
                    y = 68 - y;
                }

                // Now x should be 0-52.5 range (Near left goal)
                // Pitch component draws goal at x=0.

                // Sizing by xG (min 0.4, max 1.5 radius?)
                const r = Math.max(0.6, Math.sqrt(event.xg) * 4);

                return (
                    <motion.circle
                        key={event.id}
                        cx={x}
                        cy={y}
                        r={r}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.9, scale: 1 }}
                        transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                        fill={getEventColor(event.type)}
                        stroke="white"
                        strokeWidth="0.2"
                        className="cursor-pointer hover:opacity-100 hover:stroke-[1px]"
                        style={{ filter: `drop-shadow(0 0 2px ${getEventColor(event.type)}80)` }}
                        onMouseEnter={() => onHover && onHover(event)}
                        onMouseLeave={() => onHover && onHover(null)}
                    />
                );
            })}
        </g>
    );
};
