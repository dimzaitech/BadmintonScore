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
  currentGameIndex: number;
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


export function Scoreboard({ player1Name, player2Name, player1Score, player2Score, player1GamesWon, player2GamesWon, server, onPlayer1Point, onPlayer2Point, player1Color, player2Color, currentGameIndex }: ScoreboardProps) {
  
  const player1TextColor = getContrastingTextColor(player1Color);
  const player2TextColor = getContrastingTextColor(player2Color);

  const swapSides = currentGameIndex % 2 === 1;

  const playerLeft = {
    name: swapSides ? player2Name : player1Name,
    score: swapSides ? player2Score : player1Score,
    gamesWon: swapSides ? player2GamesWon : player1GamesWon,
    color: swapSides ? player2Color : player1Color,
    textColor: swapSides ? player2TextColor : player1TextColor,
    server: swapSides ? 1 : 0,
    onPoint: swapSides ? onPlayer2Point : onPlayer1Point,
  };

  const playerRight = {
    name: swapSides ? player1Name : player2Name,
    score: swapSides ? player1Score : player2Score,
    gamesWon: swapSides ? player1GamesWon : player2GamesWon,
    color: swapSides ? player1Color : player2Color,
    textColor: swapSides ? player1TextColor : player2TextColor,
    server: swapSides ? 0 : 1,
    onPoint: swapSides ? onPlayer1Point : onPlayer2Point,
  };

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden shadow-lg">
      {/* Player Left */}
      <div 
        className="text-center p-4 transition-colors duration-300"
        style={{ backgroundColor: playerLeft.color, color: playerLeft.textColor }}
      >
        <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: playerLeft.textColor }}>
          <User className="h-5 w-5" />
          <span className="truncate">{playerLeft.name}</span>
          {server === playerLeft.server && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p-left-${playerLeft.score}`}
          className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={playerLeft.onPoint}
          style={{ color: playerLeft.textColor }}
        >
          {playerLeft.score}
        </div>
        <div className="text-sm" style={{ color: playerLeft.textColor, opacity: 0.8 }}>Game: {playerLeft.gamesWon}</div>
      </div>

      {/* Player Right */}
      <div 
        className="text-center p-4 transition-colors duration-300"
        style={{ backgroundColor: playerRight.color, color: playerRight.textColor }}
      >
        <div className="flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: playerRight.textColor }}>
          <User className="h-5 w-5" />
          <span className="truncate">{playerRight.name}</span>
          {server === playerRight.server && <Server className="h-5 w-5 text-accent animate-pulse" />}
        </div>
        <div
          key={`p-right-${playerRight.score}`}
          className="text-7xl md:text-8xl font-bold animate-in fade-in-0 scale-90 duration-500 cursor-pointer"
          onClick={playerRight.onPoint}
          style={{ color: playerRight.textColor }}
        >
          {playerRight.score}
        </div>
        <div className="text-sm" style={{ color: playerRight.textColor, opacity: 0.8 }}>Game: {playerRight.gamesWon}</div>
      </div>
    </div>
  );
}
