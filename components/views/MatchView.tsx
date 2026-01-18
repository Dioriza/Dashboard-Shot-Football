import React from 'react';
import { Pitch } from '../Pitch';
import { ShotMap } from '../ShotMap';
import { Card } from '../ui/Card';
import { GoalMouthMap } from '../viz/GoalMouthMap';
import { TeamComparisonChart, XGTimeline, BreakdownChart } from '../viz/AnalyticsCharts';
import { DetailedStats } from '../viz/DetailedStats';
import { useDashboardStore } from '../../lib/store';
import { MatchEvent } from '../../lib/parser';

export const MatchView = () => {
    const { rawMatchData, matchStats } = useDashboardStore();

    if (!rawMatchData || !matchStats) return null;

    const comparisonData = [
        { label: 'Goals', home: matchStats.home.goals, away: matchStats.away.goals },
        { label: 'xG', home: matchStats.home.xg, away: matchStats.away.xg },
        { label: 'Shots', home: matchStats.home.totalShots, away: matchStats.away.totalShots },
        { label: 'On Target', home: matchStats.home.onTarget, away: matchStats.away.onTarget },
    ];

    const timelineData: any[] = [];
    let hCum = 0;
    let aCum = 0;
    rawMatchData.events
        .filter((e: MatchEvent) => e.type === 'goal' || e.xg > 0)
        .sort((a: MatchEvent, b: MatchEvent) => a.periodTime - b.periodTime)
        .forEach((e: MatchEvent) => {
            if (e.teamSide === 'home') hCum += e.xg;
            else aCum += e.xg;
            timelineData.push({
                name: `${Math.floor(e.periodTime / 60)}'`,
                home: Number(hCum.toFixed(2)),
                away: Number(aCum.toFixed(2))
            });
        });

    return (
        <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Row 1: Pitch Map (Large) */}
                <div className="col-span-2 row-span-2 min-h-[600px] xl:col-span-3">
                    <Card title="Shot Distribution Overlay" className="h-full flex flex-col">
                        <div className="flex flex-1 items-center justify-center bg-[#111114] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                            {/* Ambient Pitch Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E90052]/5 blur-[80px] pointer-events-none" />

                            <Pitch>
                                <ShotMap events={rawMatchData.events} />
                            </Pitch>

                            {/* Comparison Overlay (Glassmorphism) */}
                            <div className="absolute top-8 right-8 bg-[#141417]/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 w-56 group/overlay hover:scale-105 transition-transform duration-500">
                                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-4 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#E90052]" /> Efficiency Index
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-300">{matchStats.home.teamName}</span>
                                        <span className="text-xl font-black text-white">{matchStats.home.finishingEfficiency.toFixed(2)}<span className="text-[10px] text-[#E90052] ml-1">x</span></span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-300">{matchStats.away.teamName}</span>
                                        <span className="text-xl font-black text-white">{matchStats.away.finishingEfficiency.toFixed(2)}<span className="text-[10px] text-slate-500 ml-1">x</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Row 1 Side: Key Metrics & Goal Mouth */}
                <div className="col-span-1 flex flex-col gap-8">
                    <Card title="Precision Mapping">
                        <GoalMouthMap events={rawMatchData.events} />
                    </Card>

                    <Card title="Core Comparison">
                        <TeamComparisonChart data={comparisonData} />
                    </Card>
                </div>
            </div>

            {/* Row 2: Detailed Stats Grid */}
            <DetailedStats home={matchStats.home} away={matchStats.away} />

            {/* Row 3: Breakdowns and Timeline */}
            <div className="grid gap-8 md:grid-cols-3">
                <Card title="Tactical Situation">
                    <BreakdownChart data={Object.entries(matchStats.all.shotsBySituation).map(([name, value]) => ({ name, value }))} />
                </Card>
                <Card title="Execution Profile">
                    <BreakdownChart data={Object.entries(matchStats.all.shotsByBodyPart).map(([name, value]) => ({ name, value }))} />
                </Card>
                <Card title="xG Flow Continuity">
                    <XGTimeline data={timelineData} />
                </Card>
            </div>
        </div>
    );
};
