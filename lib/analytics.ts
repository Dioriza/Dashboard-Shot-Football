import { MatchEvent, MatchData } from './parser';

export interface StatSummary {
    totalShots: number;
    goals: number;
    misses: number;
    blocked: number;
    onTarget: number;
    post: number;
    xg: number;
    xgot: number;
    goalConversion: number; // %
    shotAccuracy: number; // %
    finishingEfficiency: number; // ratio (Goals / xG)
}

export interface TeamStats extends StatSummary {
    teamName: string;
    isHome: boolean;
    shotsByBodyPart: Record<string, number>;
    shotsBySituation: Record<string, number>;
}

export interface PlayerStats extends StatSummary {
    playerId: string;
    playerName: string;
    position: string;
    teamSide: 'home' | 'away';
    shotsByBodyPart: Record<string, number>;
    shotsBySituation: Record<string, number>;
}

export class AnalyticsEngine {

    public calculateMatchStats(data: MatchData) {
        const homeEvents = data.events.filter(e => e.teamSide === 'home');
        const awayEvents = data.events.filter(e => e.teamSide === 'away');

        return {
            home: this.computeStats(homeEvents, data.homeTeamName, true),
            away: this.computeStats(awayEvents, data.awayTeamName, false),
            all: this.computeStats(data.events, "Total", false)
        };
    }

    public calculatePlayerStats(data: MatchData): PlayerStats[] {
        // Group events by player
        const playerGroups = new Map<string, MatchEvent[]>();

        data.events.forEach(e => {
            if (!playerGroups.has(e.playerId)) {
                playerGroups.set(e.playerId, []);
            }
            playerGroups.get(e.playerId)!.push(e);
        });

        const stats: PlayerStats[] = [];
        playerGroups.forEach((events, playerId) => {
            const first = events[0];
            const base = this.computeStats(events, first.playerName, first.isHome);
            stats.push({
                ...base,
                playerId,
                playerName: first.playerName,
                position: first.playerPosition,
                teamSide: first.teamSide,
                shotsByBodyPart: base.shotsByBodyPart,
                shotsBySituation: base.shotsBySituation
            });
        });

        return stats.sort((a, b) => b.xg - a.xg); // Default sort by xG
    }

    private computeStats(events: MatchEvent[], teamName: string, isHome: boolean): TeamStats {
        let goals = 0;
        let misses = 0;
        let blocked = 0;
        let post = 0;
        let onTarget = 0; // saves + goals
        let xg = 0;
        let xgot = 0;

        const bodyPart: Record<string, number> = {};
        const situation: Record<string, number> = {};

        events.forEach(e => {
            xg += e.xg;
            xgot += (e.xgot || 0);

            // Counts
            if (e.type === 'goal') goals++;
            else if (e.type === 'miss') misses++;
            else if (e.type === 'block') blocked++;
            else if (e.type === 'post') post++;
            else if (e.type === 'save') onTarget++; // Saved shots are on target

            // Goals are also on target
            if (e.type === 'goal') onTarget++;

            // Breakdown
            bodyPart[e.bodyPart] = (bodyPart[e.bodyPart] || 0) + 1;
            situation[e.situation] = (situation[e.situation] || 0) + 1;
        });

        const totalShots = events.length;
        const shotAccuracy = totalShots > 0 ? (onTarget / totalShots) * 100 : 0;
        const goalConversion = totalShots > 0 ? (goals / totalShots) * 100 : 0;
        const finishingEfficiency = xg > 0 ? goals / xg : 0; // >1 is overperforming, <1 underperforming

        return {
            teamName,
            isHome,
            totalShots,
            goals,
            misses,
            blocked,
            post,
            onTarget,
            xg,
            xgot,
            shotAccuracy,
            goalConversion,
            finishingEfficiency,
            shotsByBodyPart: bodyPart,
            shotsBySituation: situation
        };
    }

    public generateInsights(homeStats: TeamStats, awayStats: TeamStats): string[] {
        const insights: string[] = [];

        // Efficiency Insight
        [homeStats, awayStats].forEach(stats => {
            const diff = stats.goals - stats.xg;
            if (diff > 0.5) {
                insights.push(`${stats.teamName} is overperforming xG by ${diff.toFixed(2)} goals.`);
            } else if (diff < -0.5) {
                insights.push(`${stats.teamName} is underperforming xG by ${Math.abs(diff).toFixed(2)} goals.`);
            }
        });

        // Comparison Insight
        if (homeStats.xg > awayStats.xg) {
            insights.push(`${homeStats.teamName} created higher quality chances (xG: ${homeStats.xg.toFixed(2)}) compared to ${awayStats.teamName} (xG: ${awayStats.xg.toFixed(2)}).`);
        }

        // Dominant Situation Insight
        const getTopKey = (obj: Record<string, number>) => Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b, '');
        const homeSit = getTopKey(homeStats.shotsBySituation);
        if (homeSit) {
            insights.push(`${homeStats.teamName} relied heavily on ${homeSit} situations.`);
        }

        return insights;
    }
}
