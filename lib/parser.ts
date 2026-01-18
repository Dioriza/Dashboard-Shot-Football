import { PLAYER_TO_TEAM } from './squads';

export interface PlayerCoordinates {
  x: number;
  y: number;
  z?: number;
}

export interface GoalMouthCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface PlayerMetadata {
  name: string;
  position: string;
  id?: number | string;
}

export interface MatchEvent {
  id: string; // generated or existing
  playerId: string;
  playerName: string;
  playerPosition: string;
  teamSide: 'home' | 'away'; // Normalized from isHome
  type: 'shot' | 'goal' | 'miss' | 'save' | 'block' | 'post';
  situation: string; // fast-break, assisted, regular, etc.
  bodyPart: string; // right-foot, left-foot, head
  location: PlayerCoordinates;
  goalMouth?: GoalMouthCoordinates;
  xg: number;
  xgot?: number;
  periodTime: number; // seconds
  isHome: boolean;
}

export interface MatchData {
  homeTeamName: string;
  awayTeamName: string;
  events: MatchEvent[];
}

/**
 * Normalizes raw input data into a structured MatchEvent array.
 * Handles missing fields and detects basic team info.
 */
export class DataParser {
  private rawData: any[];

  constructor(rawData: any[]) {
    this.rawData = rawData
      ? (Array.isArray(rawData) ? rawData : (rawData as any).shotmap || [])
      : [];
  }

  public parse(): MatchData {
    if (!this.rawData || this.rawData.length === 0) {
      throw new Error("No data found to parse");
    }

    // 1. First pass: Parse events and collect potential team names
    const events: MatchEvent[] = this.rawData.map((item: any, index: number) => {
      const player = item.player || {};
      const coords = item.playerCoordinates || {};
      const goalMouth = item.goalMouthCoordinates || {};

      return {
        id: item.id ? String(item.id) : `event-${index}`,
        playerId: String(player.id || `unknown-${index}`),
        playerName: player.name || player.shortName || "Unknown Player",
        playerPosition: player.position || "Unknown",
        teamSide: item.isHome ? 'home' : 'away',
        isHome: !!item.isHome,
        type: this.normalizeShotType(item.shotType, item.incidentType),
        situation: item.situation || "regular",
        bodyPart: item.bodyPart || "unknown",
        location: {
          x: typeof coords.x === 'number' ? coords.x : 0,
          y: typeof coords.y === 'number' ? coords.y : 0,
          z: coords.z
        },
        goalMouth: {
          x: typeof goalMouth.x === 'number' ? goalMouth.x : 0,
          y: typeof goalMouth.y === 'number' ? goalMouth.y : 0,
          z: typeof goalMouth.z === 'number' ? goalMouth.z : 0,
        },
        xg: typeof item.xg === 'number' ? item.xg : 0,
        xgot: typeof item.xgot === 'number' ? item.xgot : 0,
        periodTime: this.normalizeTime(item),
      };
    });

    // 2. Advanced Team Detection using PLAYER_TO_TEAM
    const homeTeamCounts: Record<string, number> = {};
    const awayTeamCounts: Record<string, number> = {};

    events.forEach(e => {
      const teamName = PLAYER_TO_TEAM[e.playerName];
      if (teamName) {
        if (e.isHome) {
          homeTeamCounts[teamName] = (homeTeamCounts[teamName] || 0) + 1;
        } else {
          awayTeamCounts[teamName] = (awayTeamCounts[teamName] || 0) + 1;
        }
      }
    });

    // Determine consensus team name for each side
    let homeTeamName = Object.entries(homeTeamCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    let awayTeamName = Object.entries(awayTeamCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    // 3. Fallback to basic heuristics if player mapping failed
    if (!homeTeamName) {
      const homeEvent = this.rawData.find((item: any) => item.isHome === true && (item.player?.team?.name || item.team?.name));
      homeTeamName = homeEvent?.player?.team?.name || homeEvent?.team?.name || "Home Team";
    }

    if (!awayTeamName) {
      const awayEvent = this.rawData.find((item: any) => item.isHome === false && (item.player?.team?.name || item.team?.name));
      awayTeamName = awayEvent?.player?.team?.name || awayEvent?.team?.name || "Away Team";
    }

    // Special Case: Ensure we don't have the same name for both unless it's a very weird dataset
    if (homeTeamName === awayTeamName && homeTeamName !== "Unknown") {
      console.warn("Parser: Detected identical names for both sides, checking frequency...");
      // If counts are similar, it might be a split file? 
    }

    console.log(`Parser: Final Detection -> Home: ${homeTeamName}, Away: ${awayTeamName}`);

    return {
      homeTeamName,
      awayTeamName,
      events
    };
  }

  private normalizeShotType(shotType: string, incidentType: string): MatchEvent['type'] {
    const valid = ['shot', 'goal', 'miss', 'save', 'block', 'post'];
    if (valid.includes(shotType)) return shotType as MatchEvent['type'];
    if (incidentType === 'shot') return 'shot'; // Fallback
    return 'miss'; // Default fallback
  }

  private normalizeTime(item: any): number {
    if (typeof item.periodTimeSeconds === 'number') return item.periodTimeSeconds;
    if (typeof item.timeSeconds === 'number') return item.timeSeconds;
    // Fallback: estimate from minute
    if (typeof item.time === 'number') return item.time * 60;
    return 0;
  }
}
