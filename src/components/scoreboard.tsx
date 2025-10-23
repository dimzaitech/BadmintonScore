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
}

export function Scoreboard({ player1Name, player2Name, player1Score, player2Score, player1GamesWon, player2GamesWon, server }: ScoreboardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg bg-card-foreground text-card p-4 md:p-6 shadow-lg">
      {/* Player 1 */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          <span className="truncate">{player1Name}</span>
          {server === 0 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div key={`p1-${player1Score}`} className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500">
          {player1Score}
        </div>
        <div className="text-sm text-muted-foreground bg-card-foreground px-2 py-1 rounded-md">Game: {player1GamesWon}</div>
      </div>

      {/* Player 2 */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          <span className="truncate">{player2Name}</span>
          {server === 1 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div key={`p2-${player2Score}`} className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500">
          {player2Score}
        </div>
        <div className="text-sm text-muted-foreground bg-card-foreground px-2 py-1 rounded-md">Game: {player2GamesWon}</div>
      </div>
    </div>
  );
}
