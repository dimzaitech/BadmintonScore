
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useMatchState } from '@/hooks/use-match-state';
import type { MatchConfig } from '@/lib/types';
import { Scoreboard } from '@/components/scoreboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Undo, Redo, Sparkles, RefreshCw, Timer, Trophy } from 'lucide-react';
import { MatchSummaryCard } from '@/components/match-summary-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { MatchStatisticsInput } from '@/ai/flows/match-statistics-generation';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { useFullscreenContext } from '@/context/fullscreen-context';


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
  const { state, awardPoint, undo, redo, canUndo, canRedo, saveMatch, swapSides } = useMatchState(matchConfig);
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  const [isWinnerAlertOpen, setIsWinnerAlertOpen] = useState(false);
  const { isLandscape } = useFullscreen();
  const { setIsFullscreen } = useFullscreenContext();
  
  useEffect(() => {
    const scoreboardEl = document.getElementById('scoreboard-container');
    const body = document.body;

    if (isLandscape && scoreboardEl) {
      setIsFullscreen(true);
      body.classList.add('fullscreen-scoreboard-active');
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    } else {
      setIsFullscreen(false);
      body.classList.remove('fullscreen-scoreboard-active');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    return () => {
      body.classList.remove('fullscreen-scoreboard-active');
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    };
  }, [isLandscape, setIsFullscreen]);
  
  const handleSaveMatch = useCallback(() => {
    if (state.winner !== null) {
      saveMatch();
      toast({
        title: "Pertandingan Disimpan!",
        description: "Pertandingan telah disimpan ke riwayat Anda.",
      });
    }
  }, [state.winner, saveMatch, toast]);

  useEffect(() => {
    if (state.winner !== null) {
      setIsWinnerAlertOpen(true);
      handleSaveMatch();
    }
  }, [state.winner, handleSaveMatch]);


  const handleAwardPoint = (player: 0 | 1) => {
    if (state.winner === null) {
      awardPoint(player);
    }
  };
  
  const handleGenerateSummary = () => {
    setShowSummary(true);
    // The match is already saved, here we might update it with a summary if needed,
    // or the MatchSummaryCard can handle its own logic to save the summary.
  }

  const winnerName = state.winner !== null ? state.config[`player${state.winner + 1}Name` as 'player1Name' | 'player2Name'] : null;
  
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
    <div className="w-full space-y-4 animate-in fade-in-0">
        <div className="flex justify-between items-center px-2">
            <div className="flex items-center space-x-2">
                <Button onClick={undo} disabled={!canUndo} variant="ghost" size="icon" aria-label="Batal"><Undo className="h-5 w-5" /></Button>
                <Button onClick={redo} disabled={!canRedo} variant="ghost" size="icon" aria-label="Ulangi"><Redo className="h-5 w-5" /></Button>
            </div>
            <TimerDisplay />
        </div>
        
        <Scoreboard 
            state={state}
            onPlayer1Point={() => handleAwardPoint(0)}
            onPlayer2Point={(): void => handleAwardPoint(1)}
            onSwapSides={swapSides}
        />

      {state.winner !== null && (
        <AlertDialog open={isWinnerAlertOpen} onOpenChange={setIsWinnerAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader className="items-center">
              <Trophy className="h-16 w-16 text-amber-500" />
              <AlertDialogTitle className="text-3xl text-primary">Pertandingan Selesai!</AlertDialogTitle>
              <div className="text-sm text-muted-foreground text-center">
                <div className="text-xl font-semibold text-foreground">{winnerName} memenangkan pertandingan!</div>
                <div className="text-lg text-muted-foreground">{state.gamesWon.join(' - ')}</div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
              {!showSummary && statsInput && (
                <AlertDialogAction className="w-full" onClick={handleGenerateSummary}>
                  <Sparkles className="mr-2 h-4 w-4"/>Buat Ringkasan Pertandingan
                </AlertDialogAction>
              )}
              <AlertDialogAction className="w-full" onClick={onNewMatch}>
                <RefreshCw className="mr-2 h-4 w-4"/>Mulai Pertandingan Baru
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showSummary && statsInput && (
        <Card className="animate-in fade-in-50 zoom-in-95">
            <CardHeader>
                <CardTitle>Ringkasan Pertandingan</CardTitle>
            </CardHeader>
            <CardContent>
                <MatchSummaryCard statsInput={statsInput} />
            </CardContent>
            <CardFooter>
                 <Button variant="outline" onClick={onNewMatch} className="w-full"><RefreshCw className="mr-2 h-4 w-4"/>Pertandingan Baru</Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
