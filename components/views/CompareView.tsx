import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '../../lib/store';
import { Card } from '../ui/Card';
import { PlayerRadar } from '../viz/AnalyticsCharts';
import { PlayerStats } from '../../lib/analytics';
import { Search, Plus, X } from 'lucide-react';

export const CompareView = () => {
    const { playerStats, selectedPlayerId, comparePlayerId, setPlayerFilter, setComparePlayer } = useDashboardStore();
    const [searchQuery, setSearchQuery] = useState('');

    const player1 = playerStats.find(p => p.playerId === selectedPlayerId) || playerStats[0];
    const player2 = playerStats.find(p => p.playerId === comparePlayerId) || playerStats[1] || playerStats[0];

    const filteredPlayers = useMemo(() => {
        if (!searchQuery) return [];
        return playerStats.filter(p =>
            p.playerName.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery, playerStats]);

    const renderMetric = (label: string, val1: number | string, val2: number | string) => (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
            <div className="text-right flex-1">
                <span className="text-white font-black text-sm tabular-nums">{val1}</span>
            </div>
            <div className="flex-1 text-center">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-left flex-1">
                <span className="text-white font-black text-sm tabular-nums">{val2}</span>
            </div>
        </div>
    );

    const radarData = [
        { subject: 'Goals', value: (player1?.goals || 0) * 33, compareValue: (player2?.goals || 0) * 33 },
        { subject: 'xG', value: (player1?.xg || 0) * 50, compareValue: (player2?.xg || 0) * 50 },
        { subject: 'Shots', value: (player1?.totalShots || 0) * 20, compareValue: (player2?.totalShots || 0) * 20 },
        { subject: 'On Target', value: (player1?.onTarget || 0) * 25, compareValue: (player2?.onTarget || 0) * 25 },
        { subject: 'Efficiency', value: (player1?.finishingEfficiency || 0) * 100, compareValue: (player2?.finishingEfficiency || 0) * 100 }
    ];

    return (
        <div className="space-y-6">
            {/* Search and Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for Primary Player..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00FF85] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && filteredPlayers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C21] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {filteredPlayers.map(p => (
                                <button
                                    key={p.playerId}
                                    className="w-full text-left px-5 py-3 hover:bg-white/5 text-slate-400 hover:text-white flex justify-between items-center transition-colors text-xs"
                                    onClick={() => {
                                        setPlayerFilter(p.playerId);
                                        setSearchQuery('');
                                    }}
                                >
                                    <span className="font-bold">{p.playerName}</span>
                                    <span className="text-[9px] uppercase opacity-50 font-black">{p.teamSide}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Compare with Player..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#E90052] transition-all"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            const found = playerStats.find(p => p.playerName.toLowerCase().includes(val.toLowerCase()));
                            if (found) setComparePlayer(found.playerId);
                        }}
                    />
                </div>
            </div>

            {/* Comparison Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Player Card */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card p-6 rounded-[1.5rem] border-l-4 border-[#00FF85] text-center">
                        <div className="w-16 h-16 bg-[#00FF85]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00FF85]/20">
                            <span className="text-xl font-black text-[#00FF85]">{player1?.playerName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight mb-1">{player1?.playerName}</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{player1?.position}</p>
                    </div>

                    <Card title="Quick Stats">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Goals</span>
                                <span className="text-lg font-black text-white">{player1?.goals}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">xG</span>
                                <span className="text-lg font-black text-white">{player1?.xg.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Center Comparison Radar */}
                <div className="lg:col-span-6">
                    <Card title="Elite Performance Comparison" className="h-full">
                        <div className="h-[350px] flex items-center justify-center -mt-4">
                            <PlayerRadar data={radarData} comparisonData={radarData} />
                        </div>
                        <div className="flex justify-center gap-6 mt-2 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF85]" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{player1?.playerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#E90052]" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{player2?.playerName}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Player Card */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card p-6 rounded-[1.5rem] border-r-4 border-[#E90052] text-center">
                        <div className="w-16 h-16 bg-[#E90052]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E90052]/20">
                            <span className="text-xl font-black text-[#E90052]">{player2?.playerName.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight mb-1">{player2?.playerName}</h3>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{player2?.position}</p>
                    </div>

                    <Card title="Quick Stats">
                        <div className="space-y-3 text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Goals</span>
                                <span className="text-lg font-black text-white">{player2?.goals}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">xG</span>
                                <span className="text-lg font-black text-white">{player2?.xg.toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detailed Head-to-Head Grid */}
            <Card title="Precision Head-to-Head Metrics">
                <div className="max-w-3xl mx-auto py-4">
                    {renderMetric('Total Goals', player1.goals, player2.goals)}
                    {renderMetric('Expected Goals', player1.xg.toFixed(2), player2.xg.toFixed(2))}
                    {renderMetric('Shots on Target', player1.onTarget, player2.onTarget)}
                    {renderMetric('Conversion Rate', `${player1.goalConversion.toFixed(1)}%`, `${player2.goalConversion.toFixed(1)}%`)}
                    {renderMetric('Finishing Efficiency', `${player1.finishingEfficiency.toFixed(2)}x`, `${player2.finishingEfficiency.toFixed(2)}x`)}
                </div>
            </Card>
        </div>
    );
};
