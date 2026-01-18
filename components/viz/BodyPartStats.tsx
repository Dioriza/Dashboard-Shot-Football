import React from 'react';

interface BodyPartStatsProps {
    stats: Record<string, number>;
}

export const BodyPartStats = ({ stats }: BodyPartStatsProps) => {
    const leftFoot = stats['left-foot'] || 0;
    const rightFoot = stats['right-foot'] || 0;
    const head = stats['head'] || 0;
    const other = stats['other'] || 0;
    const total = leftFoot + rightFoot + head + other || 1;

    const getPercent = (val: number) => ((val / total) * 100).toFixed(0);

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-56 mb-4">
                {/* Simple Humanoid Silhouette / Icon Placeholder */}
                <svg viewBox="0 0 100 150" className="w-full h-full opacity-10 fill-slate-400">
                    <circle cx="50" cy="20" r="15" />
                    <rect x="35" y="38" width="30" height="60" rx="5" />
                    <rect x="25" y="40" width="10" height="50" rx="5" />
                    <rect x="65" y="40" width="10" height="50" rx="5" />
                    <rect x="35" y="100" width="12" height="40" rx="5" />
                    <rect x="53" y="100" width="12" height="40" rx="5" />
                </svg>

                {/* Stat Overlays */}
                {/* Head */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Head</div>
                    <div className="bg-[#E90052]/20 border border-[#E90052]/30 px-2 py-0.5 rounded-full text-white font-black text-[9px]">
                        {head} <span className="text-[7px] opacity-60">{getPercent(head)}%</span>
                    </div>
                </div>

                {/* Left Foot */}
                <div className="absolute bottom-2 left-[-10px] flex flex-col items-center">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Left Foot</div>
                    <div className="bg-[#00FF85]/20 border border-[#00FF85]/30 px-2 py-0.5 rounded-full text-white font-black text-[9px]">
                        {leftFoot} <span className="text-[7px] opacity-60">{getPercent(leftFoot)}%</span>
                    </div>
                </div>

                {/* Right Foot */}
                <div className="absolute bottom-2 right-[-10px] flex flex-col items-center">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Right Foot</div>
                    <div className="bg-[#0070F3]/20 border border-[#0070F3]/30 px-2 py-0.5 rounded-full text-white font-black text-[9px]">
                        {rightFoot} <span className="text-[7px] opacity-60">{getPercent(rightFoot)}%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Strongest</div>
                    <div className="text-white font-black text-[10px] uppercase leading-tight">
                        {rightFoot >= leftFoot ? 'Right Foot' : 'Left Foot'}
                    </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Variety</div>
                    <div className="text-white font-black text-[10px] uppercase leading-tight">
                        {[head, leftFoot, rightFoot].filter(v => v > 0).length} Parts
                    </div>
                </div>
            </div>
        </div>
    );
};
