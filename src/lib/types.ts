export type MatchConfig = {
  player1Name: string;
  player2Name: string;
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
};

export type MatchData = GameState & {
  id: string;
  timestamp: number;
  summary?: string;
};
