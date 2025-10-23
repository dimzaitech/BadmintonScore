"use client";

import { useEffect, useState } from "react";
import type { MatchData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Trophy } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const MATCH_HISTORY_KEY = "smashscore_history";

export function HistoryList() {
  const [history, setHistory] = useState<MatchData[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHistory = localStorage.getItem(MATCH_HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse match history:", error);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(MATCH_HISTORY_KEY);
    setHistory([]);
  };

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
        <p className="font-semibold">No matches played yet.</p>
        <p>Go back to the main page to start a new match!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="destructive" onClick={clearHistory}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear History
        </Button>
      </div>
      {history.slice().reverse().map((match) => (
        <Card key={match.id} className="animate-in fade-in-0">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="truncate">
                {match.config.player1Name} vs {match.config.player2Name}
              </span>
              {match.winner !== null && (
                <span className="text-sm font-medium text-amber-500 flex items-center bg-amber-500/10 px-2 py-1 rounded-md">
                  <Trophy className="mr-2 h-4 w-4" />
                  {match.winner === 0 ? match.config.player1Name : match.config.player2Name} won
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {format(new Date(match.timestamp), "PPP p")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-lg font-semibold truncate">{match.config.player1Name}</p>
                <p className="text-4xl font-bold text-primary">{match.gamesWon[0]}</p>
              </div>
              <div className="self-center text-2xl text-muted-foreground">vs</div>
              <div>
                <p className="text-lg font-semibold truncate">{match.config.player2Name}</p>
                <p className="text-4xl font-bold text-primary">{match.gamesWon[1]}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Game scores: {match.scores.filter(s => s[0] !== 0 || s[1] !== 0).map(s => s.join('-')).join(', ')}
            </div>
            {match.summary && (
              <div className="mt-4 p-4 bg-background rounded-md border">
                <h4 className="font-semibold mb-2 text-primary">AI Summary</h4>
                <p className="text-sm whitespace-pre-wrap">{match.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
