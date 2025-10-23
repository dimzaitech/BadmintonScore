'use client';

import { useState, useEffect } from 'react';
import type { MatchData } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingUp, Percent, Star } from 'lucide-react';

const MATCH_HISTORY_KEY = 'smashscore_history';

interface PlayerStats {
  wins: number;
  losses: number;
  totalPoints: number;
  totalMatches: number;
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Record<string, PlayerStats>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedHistory = localStorage.getItem(MATCH_HISTORY_KEY);
      if (storedHistory) {
        const history: MatchData[] = JSON.parse(storedHistory);
        const playerStats: Record<string, PlayerStats> = {};

        history.forEach(match => {
          const { player1Name, player2Name } = match.config;
          
          // Initialize stats if not present
          if (!playerStats[player1Name]) playerStats[player1Name] = { wins: 0, losses: 0, totalPoints: 0, totalMatches: 0 };
          if (!playerStats[player2Name]) playerStats[player2Name] = { wins: 0, losses: 0, totalPoints: 0, totalMatches: 0 };

          // Update match counts
          playerStats[player1Name].totalMatches++;
          playerStats[player2Name].totalMatches++;

          // Update points
          playerStats[player1Name].totalPoints += match.scores.reduce((acc, s) => acc + s[0], 0);
          playerStats[player2Name].totalPoints += match.scores.reduce((acc, s) => acc + s[1], 0);

          // Update wins/losses
          if (match.winner !== null) {
            const winnerName = match.winner === 0 ? player1Name : player2Name;
            const loserName = match.winner === 0 ? player2Name : player1Name;
            playerStats[winnerName].wins++;
            playerStats[loserName].losses++;
          }
        });
        setStats(playerStats);
      }
    } catch (error) {
      console.error('Gagal mem-parsing statistik:', error);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const sortedPlayers = Object.entries(stats).sort(([, a], [, b]) => b.wins - a.wins);

  if (sortedPlayers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
        <p className="font-semibold">Belum ada data statistik.</p>
        <p>Mainkan beberapa pertandingan untuk melihat statistik Anda di sini!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedPlayers.map(([name, playerData]) => {
        const winRate = playerData.totalMatches > 0 ? (playerData.wins / playerData.totalMatches) * 100 : 0;
        const avgPoints = playerData.totalMatches > 0 ? (playerData.totalPoints / playerData.totalMatches) : 0;
        
        return (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="truncate">{name}</CardTitle>
              <CardDescription>{playerData.totalMatches} pertandingan dimainkan</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>Rekor M-K</span>
                </div>
                <span className="font-semibold">{playerData.wins} - {playerData.losses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4 text-green-500" />
                  <span>Rasio Kemenangan</span>
                </div>
                <span className="font-semibold">{winRate.toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span>Poin Rata-rata</span>
                </div>
                <span className="font-semibold">{avgPoints.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
