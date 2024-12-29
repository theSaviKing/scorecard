export interface State {
    homeTeam: {
        name: string;
        players: {
            id: string;
            name: string;
            isCaptain: boolean;
            goalsCaught: number;
            goalsThrown: number;
            defensivePlays: number;
        }[];
        adjustments: { value: number; reason: string }[];
    };
    awayTeam: {
        name: string;
        players: {
            id: string;
            name: string;
            isCaptain: boolean;
            goalsCaught: number;
            goalsThrown: number;
            defensivePlays: number;
        }[];
        adjustments: { value: number; reason: string }[];
    };
}
