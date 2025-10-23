"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateMatchStatistics, MatchStatisticsInput, MatchStatisticsOutput } from "@/ai/flows/match-statistics-generation";
import { useToast } from "@/hooks/use-toast";

interface MatchSummaryCardProps {
  statsInput: MatchStatisticsInput;
}

export function MatchSummaryCard({ statsInput }: MatchSummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSummary = async () => {
      try {
        setIsLoading(true);
        const result: MatchStatisticsOutput = await generateMatchStatistics(statsInput);
        setSummary(result.summary);
      } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Kesalahan",
          description: "Gagal membuat ringkasan pertandingan AI.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getSummary();
  }, [statsInput, toast]);

  return (
    <Card className="animate-in fade-in-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          Ringkasan Pertandingan Dihasilkan AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        )}
        {summary && <p className="whitespace-pre-wrap text-sm">{summary}</p>}
      </CardContent>
    </Card>
  );
}
