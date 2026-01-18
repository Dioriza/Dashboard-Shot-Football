'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Pitch } from '../components/Pitch';
import { ShotMap } from '../components/ShotMap';
import { Card } from '../components/ui/Card';
import { useDashboardStore } from '../lib/store';
import { DataParser } from '../lib/parser';
import { MatchView } from '../components/views/MatchView';
import { TeamView } from '../components/views/TeamView';
import { PlayerView } from '../components/views/PlayerView';
import { CompareView } from '../components/views/CompareView';

export default function Home() {
    const {
        rawMatchData,
        matchStats,
        activeTab,
        setMatchData,
        getTeamLogo,
        isLoading
    } = useDashboardStore();

    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = async (files: FileList | null) => {
        console.log("File upload triggered", files);
        if (!files || files.length === 0) return;
        const file = files[0];
        console.log("Processing file:", file.name, file.size, "bytes");

        const text = await file.text();
        let json: any;
        try {
            json = JSON.parse(text);
            console.log("JSON parsed successfully", json);
            const parser = new DataParser(json);
            const data = parser.parse();
            console.log("Data parsed and normalized:", data);
            setMatchData(data);
            console.log("Store updated with match data");
        } catch (e) {
            console.error("Failed to parse", e);
            alert("Error parsing file. Ensure it is valid JSON.");
        }
    };

    const Logo = ({ teamName }: { teamName: string }) => {
        const logoFile = getTeamLogo(teamName);
        return (
            <div className="flex h-20 w-20 items-center justify-center bg-white/5 rounded-2xl shadow-xl border border-white/10 p-3 group-hover:scale-110 transition-transform duration-500">
                {logoFile ? (
                    <img src={`/assets/club_logo/${logoFile}`} alt={teamName} className="h-full w-full object-contain filter drop-shadow-lg" />
                ) : (
                    <span className="text-2xl font-black text-[#E90052]">{teamName.substring(0, 2).toUpperCase()}</span>
                )}
            </div>
        );
    };

    if (!rawMatchData || !matchStats) {
        return (
            <DashboardLayout>
                <div
                    className={`flex h-[70vh] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-all duration-700 group relative overflow-hidden ${dragActive ? 'border-[#E90052] bg-[#E90052]/5' : 'border-white/10 bg-[#141417]/50'}`}
                    onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e: React.DragEvent) => {
                        e.preventDefault();
                        setDragActive(false);
                        handleFileUpload(e.dataTransfer.files);
                    }}
                >
                    {/* Animated background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#E90052] to-transparent rounded-full blur-[120px] animate-pulse" />
                    </div>

                    <div className="text-center max-w-xl px-6 relative z-10">
                        <div className="mb-10 inline-flex h-24 w-24 bg-white/5 rounded-[2rem] border border-white/10 items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:border-[#E90052]/50 transition-all duration-500">
                            📊
                        </div>
                        <h2 className="mb-4 text-5xl font-black tracking-tight text-white">Deploy <span className="text-[#E90052]">Analytics</span></h2>
                        <p className="mb-12 text-slate-400 text-lg leading-relaxed font-medium">
                            Upload your match intelligence files (JSON/CSV) to generate high-fidelity tactical insights and advanced metrics.
                        </p>

                        <input type="file" accept=".json,.csv" className="hidden" id="file-upload"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files)} />

                        <label htmlFor="file-upload" className="cursor-pointer group/btn inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-white/10 rounded-2xl hover:bg-[#E90052] transition-all shadow-2xl border border-white/10 hover:border-[#E90052]/50 hover:translate-y-[-4px]">
                            <span>Select Intelligence File</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </label>

                        <div className="mt-8 text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">Supports Opta, StatsBomb, and Custom JSON</div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header Stats with Real Logos */}
            <div className="mb-10 p-10 glass-card rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 premium-gradient opacity-30 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    {/* Home Team */}
                    <div className="flex items-center gap-6 flex-1 justify-end text-right">
                        <div>
                            <h2 className="text-2xl font-black text-white group-hover:text-[#E90052] transition-colors">{matchStats.home.teamName}</h2>
                            <div className="text-[9px] font-black text-[#00FF85] uppercase tracking-[0.2em] mt-1 bg-[#00FF85]/10 px-2 py-0.5 rounded-full inline-block">HOSTING</div>
                        </div>
                        <Logo teamName={matchStats.home.teamName} />
                    </div>

                    {/* Scoreboard */}
                    <div className="flex flex-col items-center px-10 border-x border-white/5">
                        <div className="text-[3.5rem] font-mono font-black tracking-[-0.1em] text-white leading-none flex items-baseline gap-3">
                            <span className="text-glow">{matchStats.home.goals}</span>
                            <span className="text-white/20 text-3xl tracking-normal">:</span>
                            <span className="text-glow">{matchStats.away.goals}</span>
                        </div>
                        <div className="mt-2 text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">FINAL RESULT</div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-6 flex-1 justify-start text-left">
                        <Logo teamName={matchStats.away.teamName} />
                        <div>
                            <h2 className="text-2xl font-black text-white group-hover:text-[#E90052] transition-colors">{matchStats.away.teamName}</h2>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 bg-white/5 px-2 py-0.5 rounded-full inline-block">VISITING</div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/5 max-w-4xl mx-auto text-center">
                    {[
                        { label: 'Shots', home: matchStats.home.totalShots, away: matchStats.away.totalShots },
                        { label: 'Expected Goals (xG)', home: matchStats.home.xg.toFixed(2), away: matchStats.away.xg.toFixed(2) },
                        { label: 'On Target', home: matchStats.home.onTarget, away: matchStats.away.onTarget },
                        { label: 'Shot Accuracy', home: `${matchStats.home.shotAccuracy.toFixed(0)}%`, away: `${matchStats.away.shotAccuracy.toFixed(0)}%` }
                    ].map((stat, i) => (
                        <div key={i} className="group/stat">
                            <div className="text-lg font-black text-white group-hover/stat:text-[#00FF85] transition-colors tabular-nums">
                                {stat.home} <span className="text-white/10 mx-1">/</span> {stat.away}
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1.5">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conditional Views based on Tab */}
            {activeTab === 'match' && <MatchView />}
            {activeTab === 'team' && <TeamView />}
            {activeTab === 'player' && <PlayerView />}
            {activeTab === 'compare' && <CompareView />}

        </DashboardLayout>
    );
}
