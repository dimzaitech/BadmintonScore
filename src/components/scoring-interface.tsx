"use client";

import { useState } from 'react';
import { useMatchState } from '@/hooks/use-match-state';
import type { MatchConfig } from '@/lib/types';
import { Scoreboard } from '@/components/scoreboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Undo, Redo, PlusCircle, AlertCircle, Sparkles, RefreshCw, Save } from 'lucide-react';
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

export function ScoringInterface({ matchConfig, onNewMatch }: ScoringInterfaceProps) {
  const { state, awardPoint, addFault, undo, redo, canUndo, canRedo, saveMatch } = useMatchState(matchConfig);
  const { toast } = useToast();
  const [isP1ServiceWinner, setIsP1ServiceWinner] = useState(false);
  const [isP2ServiceWinner, setIsP2ServiceWinner] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const handleAwardPoint = (player: 0 | 1) => {
    const isServiceWinner = player === 0 ? isP1ServiceWinner : isP2ServiceWinner;
    awardPoint(player, isServiceWinner);
    setIsP1ServiceWinner(false);
    setIsP2ServiceWinner(false);
  };
  
  const handleSaveMatch = (summary?: string) => {
    saveMatch(summary);
    toast({
      title: "Match Saved!",
      description: "The match has been saved to your history.",
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
              <CardTitle className="text-xl md:text-2xl">Current Match</CardTitle>
              <div className="flex items-center space-x-2">
                <Button onClick={undo} disabled={!canUndo} variant="outline" size="icon" aria-label="Undo"><Undo className="h-4 w-4" /></Button>
                <Button onClick={redo} disabled={!canRedo} variant="outline" size="icon" aria-label="Redo"><Redo className="h-4 w-4" /></Button>
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
          />
        </CardContent>
        {state.winner === null ? (
          <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlayerControls name={state.config.player1Name} onPoint={() => handleAwardPoint(0)} onFault={() => addFault(0)} isServiceWinner={isP1ServiceWinner} onServiceWinnerChange={setIsP1ServiceWinner} />
              <PlayerControls name={state.config.player2Name} onPoint={() => handleAwardPoint(1)} onFault={() => addFault(1)} isServiceWinner={isP2ServiceWinner} onServiceWinnerChange={setIsP2ServiceWinner} />
          </CardFooter>
        ) : null}
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <StatDisplay label="Service Winners" p1Stat={state.stats[0].serviceWinners} p2Stat={state.stats[1].serviceWinners} />
          <StatDisplay label="Faults" p1Stat={state.stats[0].faults} p2Stat={state.stats[1].faults} />
      </div>

      {state.winner !== null && (
        <Card className="text-center animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Match Over!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{winnerName} wins the match!</p>
            <p className="text-muted-foreground">{state.gamesWon.join(' - ')}</p>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row justify-center gap-4">
            {!showSummary && statsInput && (
              <Button onClick={() => { setShowSummary(true); handleSaveMatch(); }}><Sparkles className="mr-2 h-4 w-4"/>Generate Match Summary</Button>
            )}
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4"/>New Match</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will end the current match and start a new one. Your match has been saved.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onNewMatch}>Start New Match</AlertDialogAction>
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

function PlayerControls({ name, onPoint, onFault, isServiceWinner, onServiceWinnerChange }: { name: string, onPoint: () => void, onFault: () => void, isServiceWinner: boolean, onServiceWinnerChange: (checked: boolean) => void }) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold text-center truncate">{name}</h3>
      <Button onClick={onPoint} className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Award Point</Button>
      <div className="flex items-center space-x-2">
        <Checkbox id={`sw-${name}`} checked={isServiceWinner} onCheckedChange={(checked) => onServiceWinnerChange(checked as boolean)} />
        <Label htmlFor={`sw-${name}`} className="text-sm">Service Winner</Label>
      </div>
      <Separator />
      <Button onClick={onFault} variant="destructive" className="w-full"><AlertCircle className="mr-2 h-4 w-4" />Record Fault</Button>
    </div>
  )
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
