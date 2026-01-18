const fs = require('fs');
const path = require('path');

try {
    const rawData = fs.readFileSync('../data/team_player.json', 'utf8');
    const json = JSON.parse(rawData);

    // Create a map: "Player Name" -> "Team Name"
    // Handle duplicates? The file seems to have "Player" and "Team".
    // We will simple map name to team.

    const playerMap = {};
    json.players.forEach(p => {
        if (p.Player && p.Team) {
            playerMap[p.Player] = p.Team;
        }
    });

    const content = `// Auto-generated from data/team_player.json
export const PLAYER_TO_TEAM: Record<string, string> = ${JSON.stringify(playerMap, null, 2)};
`;

    fs.writeFileSync('./lib/squads.ts', content);
    console.log(`Generated lib/squads.ts with ${Object.keys(playerMap).length} players.`);

} catch (e) {
    console.error("Error generating squads:", e);
}
