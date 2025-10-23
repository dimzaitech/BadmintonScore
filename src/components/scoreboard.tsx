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
  player1Color: string;
  player2Color: string;
}

// Helper to determine text color based on background luminance
function getContrastingTextColor(hexcolor: string): string {
  if (!hexcolor) return '#000000';
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#020617' : '#fafafa'; // slate-950 or slate-50
}


export function Scoreboard({ player1Name, player2Name, player1Score, player2Score, player1GamesWon, player2GamesWon, server, onPlayer1Point, onPlayer2Point, player1Color, player2Color }: ScoreboardProps) {
  
  const player1TextColor = getContrastingTextColor(player1Color);
  const player2TextColor = getContrastingTextColor(player2Color);

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden shadow-lg">
      {/* Player 1 */}
      <div 
        className="text-center p-4 transition-colors duration-300"
        style={{ backgroundColor: player1Color, color: player1TextColor }}
      >
        <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: player1TextColor }}>
          <User className="h-5 w-5" />
          <span className="truncate">{player1Name}</span>
          {server === 0 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p1-${player1Score}`}
          className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={onPlayer1Point}
          style={{ color: player1TextColor }}
        >
          {player1Score}
        </div>
        <div className="text-sm" style={{ color: player1TextColor, opacity: 0.8 }}>Game: {player1GamesWon}</div>
      </div>

      {/* Player 2 */}
      <div 
        className="text-center p-4 transition-colors duration-300"
        style={{ backgroundColor: player2Color, color: player2TextColor }}
      >
        <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: player2TextColor }}>
          <User className="h-5 w-5" />
          <span className="truncate">{player2Name}</span>
          {server === 1 && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p2-${player2Score}`}
          className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={onPlayer2Point}
          style={{ color: player2TextColor }}
        >
          {player2Score}
        </div>
        <div className="text-sm" style={{ color: player2TextColor, opacity: 0.8 }}>Game: {player2GamesWon}</div>
      </div>
    </div>
  );
}
