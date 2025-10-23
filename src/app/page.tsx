'use client';

import { useState } from 'react';
import { MatchSetup } from '@/components/match-setup';
import { ScoringInterface } from '@/components/scoring-interface';
import type { MatchConfig } from '@/lib/types';

export default function Home() {
  const [matchConfig, setMatchConfig] = useState<MatchConfig | null>(null);

  const handleMatchStart = (config: MatchConfig) => {
    setMatchConfig(config);
  };

  const handleNewMatch = () => {
    setMatchConfig(null);
  };

  return (
    <div className="container mx-auto flex max-w-4xl flex-col items-center p-4 md:p-8">
      {!matchConfig ? (
        <MatchSetup onMatchStart={handleMatchStart} />
      ) : (
        <ScoringInterface matchConfig={matchConfig} onNewMatch={handleNewMatch} />
      )}
    </div>
  );
}
