import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreboardProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1GamesWon: number;
  player2GamesWon: number;
  server: 0 | 1 | null;
  onPlayer1Point: () => void;
  onPlayer2Point: () => void;
  previousScores: [number, number][];
  currentGameIndex: number;
}

// Custom SVG for shuttlecock icon
const ShuttlecockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.5 7.5C18.5 9.43 16.93 11 15 11C13.07 11 11.5 9.43 11.5 7.5C11.5 5.57 13.07 4 15 4C16.93 4 18.5 5.57 18.5 7.5Z M13 11.5L9.5 15L10.5 16L14 12.5L13 11.5Z M7 17.5L5.5 19L9 22.5L10.5 21L7 17.5Z M17 12.5L20.5 16L19.5 17L16 13.5L17 12.5Z" />
  </svg>
);


const CourtCell = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className={cn(
      "border-primary flex items-center justify-center border-2",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

export function Scoreboard({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  player1GamesWon,
  player2GamesWon,
  server,
  onPlayer1Point,
  onPlayer2Point,
  previousScores,
  currentGameIndex,
}: ScoreboardProps) {

  const swapSides = currentGameIndex % 2 === 1;

  const playerLeft = {
    name: swapSides ? player2Name : player1Name,
    score: swapSides ? player2Score : player1Score,
    gamesWon: swapSides ? player2GamesWon : player1GamesWon,
    server: swapSides ? 1 : 0,
    onPoint: swapSides ? onPlayer2Point : onPlayer1Point,
    previousGameScores: previousScores.map(score => score[swapSides ? 1 : 0])
  };

  const playerRight = {
    name: swapSides ? player1Name : player2Name,
    score: swapSides ? player1Score : player2Score,
    gamesWon: swapSides ? player1GamesWon : player2GamesWon,
    server: swapSides ? 0 : 1,
    onPoint: swapSides ? onPlayer1Point : onPlayer2Point,
    previousGameScores: previousScores.map(score => score[swapSides ? 0 : 1])
  };

  const getPreviousScore = (player: 'left' | 'right', gameIndex: number) => {
    if (gameIndex >= currentGameIndex) return null;
    const score = player === 'left' ? playerLeft.previousGameScores[gameIndex] : playerRight.previousGameScores[gameIndex];
    const opponentScore = player === 'left' ? playerRight.previousGameScores[gameIndex] : playerLeft.previousGameScores[gameIndex];

    const didWin = score > opponentScore && (score >= 21 || score === 30);
    
    return (
        <span className={cn(didWin && "text-accent font-bold")}>{score}</span>
    )
  }

  return (
    <div
      className="grid h-[60vh] max-h-[800px] w-full grid-cols-[1fr_6fr_6fr_1fr] grid-rows-[auto_1fr_1fr] gap-0.5 bg-background font-bold"
      style={{
        gridTemplateAreas: `
          'name-left name-left name-right name-right'
          'prev1-left score-left score-right prev1-right'
          'prev2-left score-left score-right prev2-right'
        `,
      }}
    >
      {/* Names */}
      <CourtCell className="border-b-0" style={{ gridArea: "name-left" }}>{playerLeft.name}</CourtCell>
      <CourtCell className="border-b-0" style={{ gridArea: "name-right" }}>{playerRight.name}</CourtCell>
      
      {/* Previous Scores */}
      <CourtCell style={{ gridArea: "prev1-left" }}>{getPreviousScore('left', 0)}</CourtCell>
      <CourtCell style={{ gridArea: "prev2-left" }}>{getPreviousScore('left', 1)}</CourtCell>
      <CourtCell style={{ gridArea: "prev1-right" }}>{getPreviousScore('right', 0)}</CourtCell>
      <CourtCell style={{ gridArea: "prev2-right" }}>{getPreviousScore('right', 1)}</CourtCell>

      {/* Main Scores */}
      <CourtCell
        className="relative cursor-pointer text-[18vh] leading-none"
        style={{ gridArea: "score-left" }}
        onClick={playerLeft.onPoint}
      >
        {playerLeft.score}
        {server === playerLeft.server && (
            <ShuttlecockIcon className="absolute right-4 top-4 h-8 w-8 text-foreground animate-pulse" />
        )}
      </CourtCell>
      <CourtCell
        className="relative cursor-pointer text-[18vh] leading-none"
        style={{ gridArea: "score-right" }}
        onClick={playerRight.onPoint}
      >
        {playerRight.score}
        {server === playerRight.server && (
            <ShuttlecockIcon className="absolute right-4 top-4 h-8 w-8 text-foreground animate-pulse" />
        )}
      </CourtCell>

      {/* Center Console */}
      <div className="absolute left-1/2 top-1/2 z-10 grid h-full w-1/4 -translate-x-1/2 -translate-y-1/2 grid-cols-2 grid-rows-[2fr_3fr_2fr_2fr] text-lg">
          <CourtCell className="col-span-2 text-4xl">{playerLeft.gamesWon}</CourtCell>
          <CourtCell className="col-span-2 !border-0"></CourtCell>
          <CourtCell className="col-span-2 !border-0"></CourtCell>
          <CourtCell className="col-span-2 !border-0"></CourtCell>
          <CourtCell className="col-span-2 text-4xl">{playerRight.gamesWon}</CourtCell>
      </div>
       <div className="absolute left-1/2 top-1/2 z-0 grid h-full w-1/4 -translate-x-1/2 -translate-y-1/2 grid-cols-2 grid-rows-[1fr_1fr] text-lg">
           <CourtCell className="col-span-1">{playerLeft.gamesWon}</CourtCell>
           <CourtCell className="col-span-1">{playerRight.gamesWon}</CourtCell>
           <CourtCell className="col-span-2"></CourtCell>
       </div>
    </div>
  );
}