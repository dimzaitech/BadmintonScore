"use client";

import { ShuttlecockIcon } from "@/components/shuttlecock-icon";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowLeftRight } from "lucide-react";
import type { GameState } from "@/lib/types";


interface ScoreboardProps {
  state: GameState;
  onPlayer1Point: () => void;
  onPlayer2Point: () => void;
  onSwapSides: () => void;
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
  state,
  onPlayer1Point,
  onPlayer2Point,
  onSwapSides,
}: ScoreboardProps) {

  const { config, scores, currentGameIndex, gamesWon, server, sidesSwapped } = state;

  const p1Score = scores[currentGameIndex][0];
  const p2Score = scores[currentGameIndex][1];

  const player1Name = config.player1Name;
  const player2Name = config.player2Name;

  const playerLeft = {
    name: sidesSwapped ? player2Name : player1Name,
    score: sidesSwapped ? p2Score : p1Score,
    gamesWon: sidesSwapped ? gamesWon[1] : gamesWon[0],
    serverIndex: sidesSwapped ? 1 : 0,
    onPoint: sidesSwapped ? onPlayer2Point : onPlayer1Point,
    color: sidesSwapped ? config.player2Color : config.player1Color,
    isPlayer1: !sidesSwapped,
  };

  const playerRight = {
    name: sidesSwapped ? player1Name : player2Name,
    score: sidesSwapped ? p1Score : p2Score,
    gamesWon: sidesSwapped ? gamesWon[0] : gamesWon[1],
    serverIndex: sidesSwapped ? 0 : 1,
    onPoint: sidesSwapped ? onPlayer1Point : onPlayer2Point,
    color: sidesSwapped ? config.player1Color : config.player2Color,
    isPlayer1: sidesSwapped,
  };

  const finishedGamesScores = scores.slice(0, currentGameIndex);

  const getShuttlecockPositionClass = (score: number) => {
    return score % 2 === 0 ? "right-4" : "left-4";
  };
  
  return (
    <div id="scoreboard-container">
      <div className="scoreboard relative w-full h-[60vh] max-h-[800px] border-4 border-primary rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 w-full h-full text-6xl md:text-8xl lg:text-9xl font-bold">
          {/* Player Left */}
          <div
            className="relative flex flex-col items-center justify-center cursor-pointer p-4"
            style={{
              backgroundColor: playerLeft.color,
              color: getContrastingTextColor(playerLeft.color),
            }}
            onClick={playerLeft.onPoint}
          >
             <div className="absolute top-4 inset-x-0 text-center text-2xl font-bold tracking-tight">
              {playerLeft.name}
            </div>
            <div className="absolute top-12 text-xl font-semibold">
              Game: {playerLeft.gamesWon}
            </div>

            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {finishedGamesScores.map((score, index) => (
                    <div key={`left-game-${index}`} className="text-lg font-bold border rounded-md px-1.5 py-0.5" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}>
                      {playerLeft.isPlayer1 ? score[0] : score[1]}
                    </div>
                ))}
            </div>

            <div className="score-display flex-grow flex items-center justify-center text-[25vh] leading-none">
              {playerLeft.score}
            </div>
            {server === playerLeft.serverIndex && state.winner === null && (
              <ShuttlecockIcon className={cn(
                  "absolute bottom-4 h-10 w-10 animate-pulse",
                  getShuttlecockPositionClass(playerLeft.score)
                )} />
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
            <div className="absolute top-4 inset-x-0 text-center text-2xl font-bold tracking-tight">
              {playerRight.name}
            </div>
            <div className="absolute top-12 text-xl font-semibold">
              Game: {playerRight.gamesWon}
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {finishedGamesScores.map((score, index) => (
                    <div key={`right-game-${index}`} className="text-lg font-bold border rounded-md px-1.5 py-0.5" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}>
                      {playerRight.isPlayer1 ? score[0] : score[1]}
                    </div>
                ))}
            </div>

            <div className="score-display flex-grow flex items-center justify-center text-[25vh] leading-none">
              {playerRight.score}
            </div>
            {server === playerRight.serverIndex && state.winner === null && (
              <ShuttlecockIcon className={cn(
                "absolute bottom-4 h-10 w-10 animate-pulse",
                getShuttlecockPositionClass(playerRight.score)
              )} />
            )}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Button onClick={onSwapSides} size="icon" variant="secondary" className="rounded-full w-12 h-12 border-2 border-primary">
              <ArrowLeftRight className="w-6 h-6"/>
          </Button>
        </div>
      </div>
    </div>
  );
}
