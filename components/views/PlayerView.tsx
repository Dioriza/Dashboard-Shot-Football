import React, { useState } from 'react';
import { useDashboardStore } from '../../lib/store';
import { Card } from '../ui/Card';
import { PlayerRadar } from '../viz/AnalyticsCharts';
import { BodyPartStats } from '../viz/BodyPartStats';
import { Pitch } from '../Pitch';
import { ShotMap } from '../ShotMap';

export const PlayerView = () => {
    const { rawMatchData, playerStats, selectedPlayerId, setPlayerFilter } = useDashboardStore();

    // Sort players by xG by default
    const sortedPlayers = [...playerStats].sort((a, b) => b.xg - a.xg);

    const selectedPlayer = selectedPlayerId
        ? playerStats.find(p => p.playerId === selectedPlayerId)
        : sortedPlayers[0];

    // Filter events for the selected player
    const playerEvents = rawMatchData && selectedPlayer
        ? rawMatchData.events.filter(e => e.playerId === selectedPlayer.playerId)
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
            {/* Player List */}
            <Card title="Active Squads" className="col-span-1 overflow-auto max-h-full custom-scrollbar">
                <div className="space-y-2 pr-2">
                    {sortedPlayers.map(player => (
                        <button
                            key={player.playerId}
                            onClick={() => setPlayerFilter(player.playerId)}
                            className={`w-full text-left px-5 py-4 rounded-2xl flex justify-between items-center transition-all duration-300 border ${selectedPlayer?.playerId === player.playerId ? 'bg-[#E90052] text-white border-[#E90052] shadow-lg shadow-[#E90052]/20 scale-[1.02]' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight">{player.playerName}</span>
                                <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{player.teamSide} • {player.position}</span>
                            </div>
                            <div className="text-xs font-black tabular-nums">
                                {player.xg.toFixed(2)} <span className="text-[8px] opacity-50">xG</span>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Detailed Player Stats */}
            <div className="col-span-1 lg:col-span-2 space-y-6 overflow-auto custom-scrollbar pr-2">
                {selectedPlayer ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Goals', value: selectedPlayer.goals, color: '#E90052' },
                                { label: 'Expected Goals', value: selectedPlayer.xg.toFixed(2), color: '#FFFFFF' },
                                { label: 'Total Shots', value: selectedPlayer.totalShots, color: '#00FF85' }
                            ].map((item, idx) => (
                                <Card key={idx} className="group/stat-card">
                                    <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-1">{item.label}</div>
                                    <div className="text-2xl font-black text-white tabular-nums" style={{ color: item.color }}>{item.value}</div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Performance Radar" className="md:col-span-2">
                                <div className="h-[350px] flex items-center justify-center">
                                    <PlayerRadar data={[
                                        { subject: 'Goals', value: selectedPlayer.goals * 33 },
                                        { subject: 'xG', value: selectedPlayer.xg * 50 },
                                        { subject: 'Shots', value: selectedPlayer.totalShots * 20 },
                                        { subject: 'On Target', value: selectedPlayer.onTarget * 25 },
                                        { subject: 'Efficiency', value: selectedPlayer.finishingEfficiency * 100 }
                                    ]} />
                                </div>
                            </Card>
                            <Card title="Shot Body Parts">
                                <BodyPartStats stats={selectedPlayer.shotsByBodyPart} />
                            </Card>
                        </div>

                        <Card title="Shot Locations" className="min-h-[350px]">
                            <div className="flex-1 min-h-[320px] flex items-center justify-center bg-[#111114] p-6 rounded-[1.5rem] border border-white/5 relative overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00FF85]/5 blur-[80px] pointer-events-none" />
                                <Pitch>
                                    <ShotMap events={playerEvents} />
                                </Pitch>
                            </div>
                        </Card>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">Select a player</div>
                )}
            </div>
        </div>
    );
};
