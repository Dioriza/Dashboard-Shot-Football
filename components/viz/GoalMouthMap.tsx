import React from 'react';
import { MatchEvent } from '../../lib/parser';
import { getEventColor } from '../../lib/utils';
import { THEME } from '../../lib/constants';

interface GoalMouthMapProps {
    events: MatchEvent[];
}

export const GoalMouthMap = ({ events }: GoalMouthMapProps) => {
    // Filter relevant events (On target, posts, goals)
    const shots = events.filter(e => ['goal', 'save', 'post', 'miss'].includes(e.type));

    return (
        <div className="relative aspect-[2/1] w-full rounded-[2rem] bg-[#141417]/30 p-8 border border-white/5 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] premium-gradient opacity-20 group-hover:opacity-40 transition-opacity" />

            <svg viewBox="0 0 100 50" className="h-full w-full overflow-visible">
                {/* Goal Frame */}
                <rect x="10" y="5" width="80" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" rx="1" />
                <rect x="10" y="5" width="80" height="40" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" rx="1" />

                {/* Ground Line */}
                <line x1="2" y1="45" x2="98" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" strokeDasharray="1 2" />

                {/* Net Pattern */}
                <pattern id="net-dark" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                    <path d="M0 2L2 0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                </pattern>
                <rect x="10" y="5" width="80" height="40" fill="url(#net-dark)" opacity="0.6" rx="1" />

                {/* Shots */}
                {shots.map(event => {
                    if (!event.goalMouth) return null;

                    const cx = 10 + (event.goalMouth.y / 100) * 80;
                    const cy = 45 - ((event.goalMouth.z) / 100) * 40; // Improved calculation for 0-100 range

                    return (
                        <circle
                            key={event.id}
                            cx={cx}
                            cy={cy}
                            r={1.5}
                            fill={getEventColor(event.type)}
                            stroke="white"
                            strokeWidth="0.2"
                            className="transition-all duration-300 hover:r-[3] cursor-help"
                            style={{ filter: `drop-shadow(0 0 4px ${getEventColor(event.type)})` }}
                        >
                            <title>{event.playerName} - {event.type} ({event.xg.toFixed(2)} xG)</title>
                        </circle>
                    );
                })}
            </svg>

            {/* Legend (Mini) */}
            <div className="absolute bottom-4 right-6 flex gap-4 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: THEME.colors.viz.goal, boxShadow: `0 0 10px ${THEME.colors.viz.goal}` }}></span> Goal</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: THEME.colors.viz.save }}></span> Save</div>
            </div>
        </div>
    );
};
