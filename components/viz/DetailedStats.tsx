import React from 'react';
import { Card } from '../ui/Card';
import { TeamStats } from '../../lib/analytics';
import { THEME } from '../../lib/constants';

interface DetailedStatsProps {
    home: TeamStats;
    away: TeamStats;
}

export const DetailedStats = ({ home, away }: DetailedStatsProps) => {
    const MetricRow = ({ label, homeVal, awayVal, isPercent = false, isRatio = false }: any) => {
        const format = (val: number) => {
            if (isPercent) return `${val.toFixed(1)}%`;
            if (isRatio) return val.toFixed(2);
            return val;
        };
        return (
            <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 text-sm group/row hover:bg-white/[0.02] px-2 transition-colors rounded-lg">
                <span className="font-bold text-white w-14 text-center tabular-nums">{format(homeVal)}</span>
                <span className="text-slate-500 flex-1 text-center font-medium uppercase tracking-wider text-[10px] group-hover/row:text-slate-300 transition-colors">{label}</span>
                <span className="font-bold text-white w-14 text-center tabular-nums">{format(awayVal)}</span>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Shooting Metrics */}
            <Card title="Shooting Accuracy & Efficiency">
                <MetricRow label="Total Shots" homeVal={home.totalShots} awayVal={away.totalShots} />
                <MetricRow label="On Target" homeVal={home.onTarget} awayVal={away.onTarget} />
                <MetricRow label="Blocked" homeVal={home.blocked} awayVal={away.blocked} />
                <MetricRow label="Hit Post" homeVal={home.post} awayVal={away.post} />
                <MetricRow label="Missed" homeVal={home.misses} awayVal={away.misses} />
                <div className="my-2 border-t border-gray-100" />
                <MetricRow label="Shooting Accuracy" homeVal={home.shotAccuracy} awayVal={away.shotAccuracy} isPercent />
                <MetricRow label="Conversion Rate" homeVal={home.goalConversion} awayVal={away.goalConversion} isPercent />
            </Card>

            {/* Section 2: Expected Metrics */}
            <Card title="Expected Goals (xG)">
                <MetricRow label="Total xG" homeVal={home.xg} awayVal={away.xg} isRatio />
                <MetricRow label="Total xGOT" homeVal={home.xgot} awayVal={away.xgot} isRatio />
                <MetricRow label="Goals vs xG" homeVal={home.goals - home.xg} awayVal={away.goals - away.xg} isRatio />
                <MetricRow label="Finishing Efficiency (Goals/xG)" homeVal={home.finishingEfficiency} awayVal={away.finishingEfficiency} isRatio />
            </Card>
        </div>
    );
};
