// Note: We will need 'fuse.js' installed later.
// For now, I'll write a mock-compatible implementation or just standard string matching 
// that can be easily enhanced with Fuse.js once packages are installed.
// Since I can't import fuse.js yet (no node_modules), I will write the logic 
// assuming Fuse will be passed in or imported later.

export interface LogoAsset {
    filename: string; // e.g. "Manchester-City-FC.png"
    teamName: string; // e.g. "Manchester City FC" (derived)
}

export class LogoMatcher {
    private assets: LogoAsset[];

    constructor(allFilenames: string[]) {
        this.assets = allFilenames.map(f => ({
            filename: f,
            teamName: this.cleanFilename(f)
        }));
    }

    /**
     * Cleans filename to a human-readable team name for matching.
     * e.g. "Manchester-City-FC.png" -> "manchester city fc"
     */
    private cleanFilename(filename: string): string {
        return filename
            .replace(/\.(png|jpg|jpeg|svg)$/i, '')
            .replace(/-/g, ' ')
            .toLowerCase();
    }

    /**
     * Finds the best matching logo for a given team name.
     * Uses simple specific heuristics + Levenshtein distance (simplified) implementation
     * to avoid dependnecy on fuse.js in this temp file.
     */
    public findLogo(teamName: string): string | null {
        if (!teamName) return null;
        const normalizedInput = teamName.toLowerCase().trim();

        // Direct match check
        const exact = this.assets.find(a => a.teamName === normalizedInput);
        if (exact) return exact.filename;

        // Specific mappings for squads.ts names
        const mappings: Record<string, string> = {
            "manchester utd": "manchester united",
            "man utd": "manchester united",
            "man city": "manchester city",
            "tottenham": "tottenham hotspur",
            "wolves": "wolverhampton wanderers",
            "bournemouth": "afc bournemouth",
            "west ham": "west ham united",
        };

        const mappedInput = mappings[normalizedInput] || normalizedInput;

        // Check exact match again after mapping
        const mappedExact = this.assets.find(a => a.teamName === mappedInput || a.teamName.includes(mappedInput));
        if (mappedExact) return mappedExact.filename;

        // Partial match check
        const partial = this.assets.find(a => {
            return a.teamName.includes(normalizedInput) || normalizedInput.includes(a.teamName);
        });
        if (partial) return partial.filename;

        // Fallback: finding the one with minimum edit distance
        let bestMatch: LogoAsset | null = null;
        let minDistance = Infinity;

        for (const asset of this.assets) {
            const dist = this.levenshtein(normalizedInput, asset.teamName);
            const ratio = dist / Math.max(normalizedInput.length, asset.teamName.length);

            if (ratio < 0.4 && ratio < minDistance) {
                minDistance = ratio;
                bestMatch = asset;
            }
        }

        return bestMatch ? bestMatch.filename : null;
    }

    // Simple Levenshtein distance for standalone usage
    private levenshtein(a: string, b: string): number {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
}
