import React from 'react';
import { useDashboardStore } from '../../lib/store';
import { MatchEvent } from '../../lib/parser';
import { Card } from '../ui/Card';
import { Pitch } from '../Pitch';
import { ShotMap } from '../ShotMap';
import { GoalMouthMap } from '../viz/GoalMouthMap';

export const TeamView = () => {
    const { rawMatchData, matchStats, selectedTeamSide, setTeamFilter } = useDashboardStore();

    if (!rawMatchData || !matchStats) return null;

    const side = selectedTeamSide || 'home';
    const stats = side === 'home' ? matchStats.home : matchStats.away;
    const events = rawMatchData.events.filter((e: MatchEvent) => e.teamSide === side);

    return (
        <div className="space-y-8">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setTeamFilter('home')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 border ${side === 'home' ? 'bg-[#E90052] text-white border-[#E90052] shadow-lg shadow-[#E90052]/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                    {matchStats.home.teamName}
                </button>
                <button
                    onClick={() => setTeamFilter('away')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 border ${side === 'away' ? 'bg-black text-white border-white/20 shadow-lg' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                >
                    {matchStats.away.teamName}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Goals', value: stats.goals, color: '#E90052' },
                    { label: 'xG', value: stats.xg.toFixed(2), color: '#FFFFFF' },
                    { label: 'Shots', value: stats.totalShots, color: '#00FF85' },
                    { label: 'Conversion', value: `${stats.goalConversion.toFixed(1)}%`, color: '#0070F3' }
                ].map((item, idx) => (
                    <Card key={idx} className="group/stat-card">
                        <div className="text-4xl font-black text-white group-hover/stat-card:scale-110 transition-transform duration-500 tabular-nums" style={{ color: item.color }}>{item.value}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mt-2">{item.label}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Shot Distribution">
                    <div className="flex items-center justify-center p-8 bg-[#111114] rounded-2xl border border-white/5 relative overflow-hidden">
                        <Pitch>
                            <ShotMap events={events} />
                        </Pitch>
                    </div>
                </Card>
                <Card title="Shooting Accuracy (Goal Mouth)">
                    <GoalMouthMap events={events} />
                </Card>
            </div>
        </div>
    );
};
