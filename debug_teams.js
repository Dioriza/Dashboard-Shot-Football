const fs = require('fs');
const path = require('path');

try {
    const rawData = fs.readFileSync('../data/shotmap_raw.json', 'utf8');
    const json = JSON.parse(rawData);
    const shotmap = json.shotmap || [];

    console.log(`Loaded ${shotmap.length} events.`);

    // Check Home Team Heuristic
    const homeEvents = shotmap.filter(e => e.isHome === true);
    console.log(`Home Events: ${homeEvents.length}`);

    const manUtdPlayers = ['Diallo', 'Mainoo', 'Casemiro', 'Fernandes', 'Rashford', 'Hojlund', 'Garnacho'];
    const foundHome = homeEvents.find(e => {
        const name = e.player?.name || "";
        return manUtdPlayers.some(p => name.includes(p));
    });

    if (foundHome) {
        console.log(`Found Man Utd player (Home): ${foundHome.player.name}`);
    } else {
        console.log("No Man Utd player found in Home events.");
        // Print first 5 home player names
        console.log("Sample Home Players:", homeEvents.slice(0, 5).map(e => e.player?.name));
    }

    // Check Away Team Heuristic
    const awayEvents = shotmap.filter(e => e.isHome === false);
    console.log(`Away Events: ${awayEvents.length}`);

    const manCityPlayers = ['Haaland', 'Silva', 'Doku', 'De Bruyne', 'Foden', 'Rodri', 'Walker'];
    const foundAway = awayEvents.find(e => {
        const name = e.player?.name || "";
        return manCityPlayers.some(p => name.includes(p));
    });

    if (foundAway) {
        console.log(`Found Man City player (Away): ${foundAway.player.name}`);
    } else {
        console.log("No Man City player found in Away events.");
        // Print first 5 away player names
        console.log("Sample Away Players:", awayEvents.slice(0, 5).map(e => e.player?.name));
    }

} catch (e) {
    console.error("Error:", e.message);
}
