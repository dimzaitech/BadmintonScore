"use client";

import { ShuttlecockIcon } from "@/components/shuttlecock-icon";
import { cn } from "@/lib/utils";

interface ScoreboardProps {
  player1Name: string;
  player2Name:string;
  player1Score: number;
  player2Score: number;
  player1GamesWon: number;
  player2GamesWon: number;
  server: 0 | 1 | null;
  onPlayer1Point: () => void;
  onPlayer2Point: () => void;
  currentGameIndex: number;
  player1Color: string;
  player2Color: string;
  scores: [number, number][];
}

const getContrastingTextColor = (hexcolor: string) => {
  if (hexcolor.startsWith("#")) {
    hexcolor = hexcolor.slice(1);
  }
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

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
  currentGameIndex,
  player1Color,
  player2Color,
  scores,
}: ScoreboardProps) {

  const swapSides = currentGameIndex % 2 === 1;

  const playerLeft = {
    name: swapSides ? player2Name : player1Name,
    score: swapSides ? player2Score : player1Score,
    gamesWon: swapSides ? player2GamesWon : player1GamesWon,
    server: swapSides ? 1 : 0,
    onPoint: swapSides ? onPlayer2Point : onPlayer1Point,
    color: swapSides ? player2Color : player1Color,
    isPlayer1: !swapSides,
  };

  const playerRight = {
    name: swapSides ? player1Name : player2Name,
    score: swapSides ? player1Score : player2Score,
    gamesWon: swapSides ? player1GamesWon : player2GamesWon,
    server: swapSides ? 0 : 1,
    onPoint: swapSides ? onPlayer1Point : onPlayer2Point,
    color: swapSides ? player1Color : player2Color,
    isPlayer1: swapSides,
  };

  const finishedGamesScores = scores.slice(0, currentGameIndex);

  return (
    <div className="grid grid-cols-2 w-full h-[60vh] max-h-[800px] text-6xl md:text-8xl lg:text-9xl font-bold border-4 border-primary rounded-lg overflow-hidden">
      {/* Player Left */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer p-4"
        style={{
          backgroundColor: playerLeft.color,
          color: getContrastingTextColor(playerLeft.color),
        }}
        onClick={playerLeft.onPoint}
      >
        <div className="absolute top-4 text-2xl font-bold tracking-tight">
          {playerLeft.name}
        </div>
        <div className="absolute top-12 text-xl font-semibold">
          Game: {playerLeft.gamesWon}
        </div>

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {finishedGamesScores.map((score, index) => (
                <div key={`left-game-${index}`} className="text-xs font-bold border rounded-md px-1.5 py-0.5" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  {playerLeft.isPlayer1 ? score[0] : score[1]}
                </div>
            ))}
        </div>

        <div className="flex-grow flex items-center justify-center text-[25vh] leading-none">
          {playerLeft.score}
        </div>
        {server === playerLeft.server && (
           <ShuttlecockIcon className="absolute bottom-4 h-10 w-10 animate-pulse" />
        )}
      </div>

      {/* Player Right */}
      <div
        className="relative flex flex-col items-center justify-center cursor-pointer p-4 border-l-2 border-primary"
        style={{
          backgroundColor: playerRight.color,
          color: getContrastingTextColor(playerRight.color),
        }}
        onClick={playerRight.onPoint}
      >
        <div className="absolute top-4 text-2xl font-bold tracking-tight">
          {playerRight.name}
        </div>
         <div className="absolute top-12 text-xl font-semibold">
          Game: {playerRight.gamesWon}
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            {finishedGamesScores.map((score, index) => (
                <div key={`right-game-${index}`} className="text-xs font-bold border rounded-md px-1.5 py-0.5" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  {playerRight.isPlayer1 ? score[0] : score[1]}
                </div>
            ))}
        </div>

        <div className="flex-grow flex items-center justify-center text-[25vh] leading-none">
          {playerRight.score}
        </div>
        {server === playerRight.server && (
          <ShuttlecockIcon className="absolute bottom-4 h-10 w-10 animate-pulse" />
        )}
      </div>
    </div>
  );
}
