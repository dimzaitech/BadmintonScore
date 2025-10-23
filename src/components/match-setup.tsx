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
import { Rocket, Users, User, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  player1Name: z.string().min(1, "Nama Pemain 1 harus diisi.").max(50),
  player2Name: z.string().min(1, "Nama Pemain 2 harus diisi.").max(50),
  player1Color: z.string(),
  player2Color: z.string(),
  matchType: z.enum(["tunggal", "ganda"]).default("tunggal"),
  firstServer: z.enum(["0", "1"]),
  tournamentMode: z.boolean().default(false),
  winningScore: z.enum(["10", "15", "21"]).default("21"),
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
      player1Color: "#e0f2fe", // light-blue
      player2Color: "#fee2e2", // light-red
      matchType: "tunggal",
      firstServer: "0",
      tournamentMode: false,
      winningScore: "21",
    },
  });

  const matchType = form.watch("matchType");

  function onSubmit(values: MatchSetupFormValues) {
    onMatchStart({
      player1Name: values.player1Name,
      player2Name: values.player2Name,
      numberOfGames: 3, // Best of 3 games
      firstServer: parseInt(values.firstServer, 10) as 0 | 1,
      player1Color: values.player1Color,
      player2Color: values.player2Color,
      winningScore: parseInt(values.winningScore, 10) as 10 | 15 | 21,
    });
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95">
      <CardHeader>
        <CardTitle className="text-2xl">Pertandingan Bulu Tangkis Baru</CardTitle>
        <CardDescription>
          Konfigurasikan detail pertandingan untuk memulai.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="matchType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipe Pertandingan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tunggal" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2"><User /> Tunggal</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="ganda" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2"><Users /> Ganda</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
              <FormField
                control={form.control}
                name="player1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{matchType === 'tunggal' ? 'Nama Pemain 1' : 'Nama Tim 1'}</FormLabel>
                    <FormControl>
                      <Input placeholder={matchType === 'tunggal' ? 'Masukkan nama pemain' : 'Masukkan nama tim'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player1Color"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="color" {...field} className="p-1 h-10 w-14 cursor-pointer" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
              <FormField
                control={form.control}
                name="player2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{matchType === 'tunggal' ? 'Nama Pemain 2' : 'Nama Tim 2'}</FormLabel>
                    <FormControl>
                      <Input placeholder={matchType === 'tunggal' ? 'Masukkan nama pemain' : 'Masukkan nama tim'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player2Color"
                render={({ field }) => (
                  <FormItem>
                     <FormControl>
                      <Input type="color" {...field} className="p-1 h-10 w-14 cursor-pointer" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="firstServer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servis Pertama</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih server" />
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
              <FormField
                control={form.control}
                name="winningScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skor Akhir</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih skor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">10 Poin</SelectItem>
                        <SelectItem value="15">15 Poin</SelectItem>
                        <SelectItem value="21">21 Poin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
           
            <FormField
              control={form.control}
              name="tournamentMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2"><ShieldCheck /> Mode Turnamen</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
