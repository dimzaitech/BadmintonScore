"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { MatchConfig } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rocket } from "lucide-react";

const formSchema = z.object({
  player1Name: z.string().min(1, "Nama Pemain 1 harus diisi.").max(50),
  player2Name: z.string().min(1, "Nama Pemain 2 harus diisi.").max(50),
  firstServer: z.enum(["0", "1"]),
});

type MatchSetupFormValues = z.infer<typeof formSchema>;

interface MatchSetupProps {
  onMatchStart: (config: MatchConfig) => void;
}

export function MatchSetup({ onMatchStart }: MatchSetupProps) {
  const form = useForm<MatchSetupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player1Name: "Pemain 1",
      player2Name: "Pemain 2",
      firstServer: "0",
    },
  });

  function onSubmit(values: MatchSetupFormValues) {
    onMatchStart({
      player1Name: values.player1Name,
      player2Name: values.player2Name,
      numberOfGames: 3, // Best of 3 games
      firstServer: parseInt(values.firstServer, 10) as 0 | 1,
    });
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95">
      <CardHeader>
        <CardTitle className="text-2xl">Pertandingan Bulu Tangkis Baru</CardTitle>
        <CardDescription>
          Konfigurasikan nama pemain dan siapa yang melakukan servis pertama untuk memulai.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="player1Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemain 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama Pemain 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="player2Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemain 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama Pemain 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstServer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Siapa yang Servis Pertama?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih siapa yang servis pertama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">{form.watch("player1Name")}</SelectItem>
                      <SelectItem value="1">{form.watch("player2Name")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Rocket className="mr-2 h-4 w-4" />
              Mulai Pertandingan
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
