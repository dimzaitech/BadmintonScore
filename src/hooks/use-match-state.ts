"use client";

import { useState, useMemo, useCallback } from 'react';
import type { MatchConfig, GameState, PlayerStats, MatchData } from '@/lib/types';

const MAX_GAMES = 3;
const WINNING_SCORE = 21;
const DEUCE_WINNING_SCORE = 30;
const MATCH_HISTORY_KEY = 'smashscore_history';

const createInitialState = (config: MatchConfig): GameState => ({
  config,
  scores: Array(MAX_GAMES).fill([0, 0]),
  currentGameIndex: 0,
  gamesWon: [0, 0],
  server: config.firstServer,
  winner: null,
  stats: [
    { faults: 0, serviceWinners: 0 },
    { faults: 0, serviceWinners: 0 },
  ],
});

export function useMatchState(config: MatchConfig) {
  const initialState = useMemo(() => createInitialState(config), [config]);
  const [history, setHistory] = useState<GameState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const updateState = useCallback((newState: GameState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
    }
  }, [canRedo]);
  
  const awardPoint = useCallback((playerIndex: 0 | 1, isServiceWinner: boolean) => {
    if (currentState.winner !== null) return;

    const newState = JSON.parse(JSON.stringify(currentState)) as GameState;

    // Update score
    newState.scores[newState.currentGameIndex][playerIndex]++;
    
    // Update server
    newState.server = playerIndex;

    // Update stats
    if (isServiceWinner) {
      newState.stats[playerIndex].serviceWinners++;
    }

    // Check for game/match win
    const [p1Score, p2Score] = newState.scores[newState.currentGameIndex];
    const gameWinner = checkGameWinner(p1Score, p2Score);

    if (gameWinner !== null) {
      newState.gamesWon[gameWinner]++;
      const matchWinner = checkMatchWinner(newState.gamesWon, MAX_GAMES);
      
      if (matchWinner !== null) {
        newState.winner = matchWinner;
      } else {
        newState.currentGameIndex++;
        // Winner of the previous game serves first in the next game
        newState.server = gameWinner;
      }
    }
    
    updateState(newState);
  }, [currentState, updateState]);
  
  const addFault = useCallback((playerIndex: 0 | 1) => {
    if (currentState.winner !== null) return;
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    
    // A fault awards a point to the opponent
    // We need to update the stats before awarding the point to avoid a race condition with state update
     const newState = JSON.parse(JSON.stringify(currentState)) as GameState;
     newState.stats[playerIndex].faults++;
     
     setHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(newState);
        return newHistory;
     });
     setHistoryIndex(prevIndex => prevIndex + 1);
    
    awardPoint(opponentIndex, false);

  }, [currentState, awardPoint, history, historyIndex]);

  const saveMatch = useCallback((summary?: string) => {
    if(currentState.winner === null) return; // Only save completed matches

    const matchData: MatchData = {
        ...currentState,
        id: new Date().toISOString(),
        timestamp: Date.now(),
        summary: summary || '',
    };
    try {
        const history = JSON.parse(localStorage.getItem(MATCH_HISTORY_KEY) || '[]') as MatchData[];
        // Avoid duplicates
        if (!history.find(m => m.id === matchData.id)) {
            history.push(matchData);
            localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(history));
        }
    } catch (error) {
        console.error("Gagal menyimpan riwayat pertandingan:", error);
    }
  }, [currentState]);


  return {
    state: currentState,
    awardPoint,
    addFault,
    undo,
    redo,
    canUndo,
    canRedo,
    saveMatch,
  };
}


function checkGameWinner(p1Score: number, p2Score: number): 0 | 1 | null {
  if (p1Score >= WINNING_SCORE && p1Score >= p2Score + 2) return 0;
  if (p2Score >= WINNING_SCORE && p2Score >= p1Score + 2) return 1;
  if (p1Score === DEUCE_WINNING_SCORE) return 0;
  if (p2Score === DEUCE_WINNING_SCORE) return 1;
  return null;
}

function checkMatchWinner(gamesWon: [number, number], maxGames: number): 0 | 1 | null {
    const gamesToWin = Math.ceil(maxGames / 2);
    if(gamesWon[0] === gamesToWin) return 0;
    if(gamesWon[1] === gamesToWin) return 1;
    return null;
}
