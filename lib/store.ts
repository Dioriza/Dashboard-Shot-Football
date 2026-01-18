import { create } from 'zustand';
import { MatchData, MatchEvent } from './parser';
import { AnalyticsEngine, TeamStats, PlayerStats } from './analytics';
import { LogoMatcher } from './matcher';
import { LOGO_FILENAMES } from './constants';

interface DashboardState {
    // Data
    rawMatchData: MatchData | null;
    isLoading: boolean;
    error: string | null;

    // Services
    logoMatcher: LogoMatcher;

    // Analytics
    matchStats: { home: TeamStats; away: TeamStats; all: TeamStats } | null;
    playerStats: PlayerStats[];
    insights: string[];

    // UI State
    activeTab: 'match' | 'team' | 'player' | 'compare';
    selectedTeamSide: 'home' | 'away' | null;
    selectedPlayerId: string | null;
    comparePlayerId: string | null;

    // Actions
    setMatchData: (data: MatchData) => void;
    setTeamFilter: (side: 'home' | 'away' | null) => void;
    setPlayerFilter: (playerId: string | null) => void;
    setComparePlayer: (playerId: string | null) => void;
    setActiveTab: (tab: 'match' | 'team' | 'player' | 'compare') => void;
    getTeamLogo: (teamName: string) => string | null;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    rawMatchData: null,
    isLoading: false,
    error: null,

    logoMatcher: new LogoMatcher(LOGO_FILENAMES),

    matchStats: null,
    playerStats: [],
    insights: [],

    activeTab: 'match',
    selectedTeamSide: null,
    selectedPlayerId: null,
    comparePlayerId: null,

    setMatchData: (data: MatchData) => {
        // initialize analytics
        const engine = new AnalyticsEngine();
        const matchStats = engine.calculateMatchStats(data);
        const playerStats = engine.calculatePlayerStats(data);
        const insights = engine.generateInsights(matchStats.home, matchStats.away);

        set({
            rawMatchData: data,
            matchStats,
            playerStats,
            insights,
            isLoading: false,
            error: null
        });
    },

    setTeamFilter: (side) => set({ selectedTeamSide: side }),
    setPlayerFilter: (playerId) => set({ selectedPlayerId: playerId }),
    setComparePlayer: (playerId) => set({ comparePlayerId: playerId }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    getTeamLogo: (teamName) => {
        const { logoMatcher } = get();
        return logoMatcher.findLogo(teamName);
    }
}));
