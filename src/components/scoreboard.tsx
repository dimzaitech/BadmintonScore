
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

  const { config, scores, currentGameIndex, gamesWon, server, sidesSwapped, team1Position, team2Position } = state;

  const getDoublesPlayerNames = (teamIndex: 0 | 1, currentScore: number, teamPosition: 0 | 1) => {
    if (config.matchType !== 'ganda' || !config.team1_player1 || !config.team1_player2 || !config.team2_player1 || !config.team2_player2) {
      return teamIndex === 0 ? config.player1Name : config.player2Name;
    }

    const team1P1 = config.team1_player1;
    const team1P2 = config.team1_player2;
    const team2P1 = config.team2_player1;
    const team2P2 = config.team2_player2;

    let p1, p2;

    if (teamIndex === 0) {
      p1 = team1P1;
      p2 = team1P2;
    } else {
      p1 = team2P1;
      p2 = team2P2;
    }

    // At the start of the game, the player who serves is determined by firstServer.
    // Let's assume the serving player starts on the right (even score).
    const isServingTeam = server === teamIndex;
    const isScoreEven = currentScore % 2 === 0;

    // 'teamPosition' tracks the server-receiver swap. 0 = initial, 1 = swapped.
    // The player on the right for an even score is the initial server.
    // The player on the left for an odd score is the initial server's partner.
    if (isServingTeam) {
      if (isScoreEven) {
        // server is on the right
        return teamPosition === 0 ? `${p2} / ${p1}` : `${p1} / ${p2}`;
      } else {
        // server is on the left
        return teamPosition === 0 ? `${p1} / ${p2}` : `${p2} / ${p1}`;
      }
    } else {
      // Non-serving team positions are based on their score at last service win.
      // This simplified logic just shows the fixed pair.
      return teamPosition === 0 ? `${p1} / ${p2}` : `${p2} / ${p1}`;
    }
  };

  const p1Score = scores[currentGameIndex][0];
  const p2Score = scores[currentGameIndex][1];

  const player1Name = getDoublesPlayerNames(0, p1Score, team1Position);
  const player2Name = getDoublesPlayerNames(1, p2Score, team2Position);

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
  
  const getNamePositionClass = (score: number) => {
    return score % 2 === 0 ? "right-4" : "left-4";
  };

  return (
    <div className="relative w-full h-[60vh] max-h-[800px] border-4 border-primary rounded-lg overflow-hidden">
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
          <div className={cn(
              "absolute top-4 text-2xl font-bold tracking-tight",
              server === playerLeft.serverIndex ? getNamePositionClass(playerLeft.score) : "inset-x-0 text-center"
            )}>
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

          <div className="flex-grow flex items-center justify-center text-[25vh] leading-none">
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
          <div className={cn(
              "absolute top-4 text-2xl font-bold tracking-tight",
              server === playerRight.serverIndex ? getNamePositionClass(playerRight.score) : "inset-x-0 text-center"
            )}>
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

          <div className="flex-grow flex items-center justify-center text-[25vh] leading-none">
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
  );
}
