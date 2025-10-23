export type MatchConfig = {
  player1Name: string; // For singles, or team name for doubles
  player2Name: string; // For singles, or team name for doubles
  
  matchType: "tunggal" | "ganda";

  numberOfGames: number;
  firstServer: 0 | 1;
  player1Color: string;
  player2Color: string;
  winningScore: 10 | 15 | 21;
};

export type PlayerStats = {
  faults: number;
  serviceWinners: number;
};

export type GameState = {
  config: MatchConfig;
  scores: [number, number][];
  currentGameIndex: number;
  gamesWon: [number, number];
  server: 0 | 1;
  winner: 0 | 1 | null;
  sidesSwapped: boolean;
  stats: [PlayerStats, PlayerStats];
  // Tracks the player position for doubles. 0 = initial, 1 = swapped
  team1Position: 0 | 1; 
  team2Position: 0 | 1;
};

export type MatchData = GameState & {
  id: string;
  timestamp: number;
  summary?: string;
};
