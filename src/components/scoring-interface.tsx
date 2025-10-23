"use client";

import { useState, useEffect } from 'react';
import { useMatchState } from '@/hooks/use-match-state';
import type { MatchConfig } from '@/lib/types';
import { Scoreboard } from '@/components/scoreboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Undo, Redo, Sparkles, RefreshCw, Timer } from 'lucide-react';
import { MatchSummaryCard } from '@/components/match-summary-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { MatchStatisticsInput } from '@/ai/flows/match-statistics-generation';

interface ScoringInterfaceProps {
  matchConfig: MatchConfig;
  onNewMatch: () => void;
}

function TimerDisplay() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
        <Timer className="h-4 w-4" />
        <span>{formatTime(time)}</span>
    </div>
  )
}


export function ScoringInterface({ matchConfig, onNewMatch }: ScoringInterfaceProps) {
  const { state, awardPoint, undo, redo, canUndo, canRedo, saveMatch } = useMatchState(matchConfig);
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  
  const handleAwardPoint = (player: 0 | 1) => {
    awardPoint(player, false);
  };
  
  const handleSaveMatch = (summary?: string) => {
    saveMatch(summary);
    toast({
      title: "Pertandingan Disimpan!",
      description: "Pertandingan telah disimpan ke riwayat Anda.",
    });
  }

  const winnerName = state.winner !== null ? state.config[`player${state.winner + 1}Name` as keyof MatchConfig] : null;
  
  const statsInput: MatchStatisticsInput | null = state.winner !== null ? {
      player1Name: state.config.player1Name,
      player2Name: state.config.player2Name,
      player1Points: state.scores.reduce((acc, score) => acc + score[0], 0),
      player2Points: state.scores.reduce((acc, score) => acc + score[1], 0),
      player1ServiceWinners: state.stats[0].serviceWinners,
      player2ServiceWinners: state.stats[1].serviceWinners,
      player1Faults: state.stats[0].faults,
      player2Faults: state.stats[1].faults,
    } : null;

  return (
    <div className="w-full space-y-6 animate-in fade-in-0 zoom-in-95">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl md:text-2xl">Pertandingan Saat Ini</CardTitle>
              <div className="flex items-center space-x-2">
                <TimerDisplay />
                <Button onClick={undo} disabled={!canUndo} variant="outline" size="icon" aria-label="Batal"><Undo className="h-4 w-4" /></Button>
                <Button onClick={redo} disabled={!canRedo} variant="outline" size="icon" aria-label="Ulangi"><Redo className="h-4 w-4" /></Button>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <Scoreboard 
            player1Name={state.config.player1Name}
            player2Name={state.config.player2Name}
            player1Score={state.scores[state.currentGameIndex][0]}
            player2Score={state.scores[state.currentGameIndex][1]}
            player1GamesWon={state.gamesWon[0]}
            player2GamesWon={state.gamesWon[1]}
            server={state.winner === null ? state.server : null}
            onPlayer1Point={() => handleAwardPoint(0)}
            onPlayer2Point={() => handleAwardPoint(1)}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <StatDisplay label="Pemenang Servis" p1Stat={state.stats[0].serviceWinners} p2Stat={state.stats[1].serviceWinners} />
          <StatDisplay label="Kesalahan" p1Stat={state.stats[0].faults} p2Stat={state.stats[1].faults} />
      </div>

      {state.winner !== null && (
        <Card className="text-center animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Pertandingan Selesai!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{winnerName} memenangkan pertandingan!</p>
            <p className="text-muted-foreground">{state.gamesWon.join(' - ')}</p>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row justify-center gap-4">
            {!showSummary && statsInput && (
              <Button onClick={() => { setShowSummary(true); handleSaveMatch(); }}><Sparkles className="mr-2 h-4 w-4"/>Buat Ringkasan Pertandingan</Button>
            )}
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4"/>Pertandingan Baru</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ini akan mengakhiri pertandingan saat ini dan memulai yang baru. Pertandingan Anda telah disimpan.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onNewMatch}>Mulai Pertandingan Baru</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
      
      {showSummary && statsInput && <MatchSummaryCard statsInput={statsInput} />}
    </div>
  );
}

function StatDisplay({ label, p1Stat, p2Stat }: { label: string, p1Stat: number, p2Stat: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around items-center">
                <span className="text-2xl font-bold">{p1Stat}</span>
                <Separator orientation="vertical" className="h-8"/>
                <span className="text-2xl font-bold">{p2Stat}</span>
            </CardContent>
        </Card>
    )
}
