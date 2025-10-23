import { cn } from "@/lib/utils";
import { User, Server } from "lucide-react";

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
}

export function Scoreboard({ player1Name, player2Name, player1Score, player2Score, player1GamesWon, player2GamesWon, server, onPlayer1Point, onPlayer2Point }: ScoreboardProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden shadow-lg">
      {/* Player 1 */}
      <div className="bg-blue-600/10 text-center p-4">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary">
          <User className="h-5 w-5" />
          <span className="truncate">{player1Name}</span>
          {server === 0 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p1-${player1Score}`}
          className="text-7xl md:text-8xl font-bold text-primary animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={onPlayer1Point}
        >
          {player1Score}
        </div>
        <div className="text-sm text-primary/80">Game: {player1GamesWon}</div>
      </div>

      {/* Player 2 */}
      <div className="bg-red-600/10 text-center p-4">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-destructive">
          <User className="h-5 w-5" />
          <span className="truncate">{player2Name}</span>
          {server === 1 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p2-${player2Score}`}
          className="text-7xl md:text-8xl font-bold text-destructive animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={onPlayer2Point}
        >
          {player2Score}
        </div>
        <div className="text-sm text-destructive/80">Game: {player2GamesWon}</div>
      </div>
    </div>
  );
}
