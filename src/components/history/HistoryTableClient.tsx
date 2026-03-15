"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatAiMessage } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WeekSummary } from "@/lib/types";

interface HistoryTableClientProps {
  history: WeekSummary[];
  userName: string;
  goalFrequency: number;
  missesThisMonth: number;
}

async function fetchReflection(context: {
  userName: string;
  missedDay: string;
  penaltyAmount: number;
  missesThisMonth: number;
  goalFrequency: number;
  sessionsRemaining: number;
  daysLeftInWeek: number;
}): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "reflection", context }),
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = (await res.json()) as { text?: string };
    const raw = data.text ?? "You missed a session. Get back on track this week.";
    return formatAiMessage(raw);
  } catch {
    return "You missed a session. Get back on track this week.";
  }
}

export function HistoryTableClient({
  history,
  userName,
  goalFrequency,
  missesThisMonth,
}: HistoryTableClientProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggle = async (week: WeekSummary) => {
    const id = week.id;
    if (expanded.has(id)) {
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }

    setExpanded((prev) => new Set(prev).add(id));

    if (reflections[id]) return;

    setLoading((prev) => ({ ...prev, [id]: true }));

    const missedDay = (week.missedDays ?? []).length
      ? week.missedDays!.join(" and ")
      : "a session";
    const sessionsRemaining = Math.max(
      0,
      goalFrequency - week.sessionsCompleted
    );
    const endOfWeek = new Date(week.endDate);
    const today = new Date();
    const daysLeftInWeek =
      endOfWeek >= today
        ? Math.ceil((endOfWeek.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const text = await fetchReflection({
      userName,
      missedDay,
      penaltyAmount: week.penaltiesCharged,
      missesThisMonth,
      goalFrequency,
      sessionsRemaining,
      daysLeftInWeek,
    });

    setReflections((prev) => ({ ...prev, [id]: text }));
    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="min-w-0 overflow-x-auto rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
      <Table className="min-w-[400px] table-fixed">
        <TableHeader>
          <TableRow className="border-[rgba(255,255,255,0.07)] hover:bg-transparent">
            <TableHead className="w-10" />
            <TableHead className="text-[rgba(240,239,232,0.6)]">
              Date range
            </TableHead>
            <TableHead className="text-[rgba(240,239,232,0.6)]">
              Sessions completed
            </TableHead>
            <TableHead className="text-[rgba(240,239,232,0.6)]">
              Sessions missed
            </TableHead>
            <TableHead className="text-[rgba(240,239,232,0.6)]">
              Penalties charged
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((week) => {
            const hasPenalties = week.penaltiesCharged > 0;
            const isExpanded = expanded.has(week.id);

            return (
              <Fragment key={week.id}>
                <TableRow
                  className="cursor-pointer border-[rgba(255,255,255,0.07)] hover:bg-[#131315]"
                  onClick={() => hasPenalties && toggle(week)}
                >
                  <TableCell className="w-10 py-4">
                    {hasPenalties ? (
                      isExpanded ? (
                        <ChevronDown className="size-4 text-[rgba(240,239,232,0.6)]" />
                      ) : (
                        <ChevronRight className="size-4 text-[rgba(240,239,232,0.6)]" />
                      )
                    ) : null}
                  </TableCell>
                  <TableCell className="font-medium text-[#f0efe8]">
                    {week.dateRange}
                  </TableCell>
                  <TableCell className="font-mono text-[#f0efe8]">
                    {week.sessionsCompleted}
                  </TableCell>
                  <TableCell className="font-mono text-[#f07070]">
                    {week.sessionsMissed}
                  </TableCell>
                  <TableCell className="font-mono text-[#f07070]">
                    ${week.penaltiesCharged}
                  </TableCell>
                </TableRow>
                {hasPenalties && isExpanded && (
                  <TableRow
                    key={`${week.id}-expand`}
                    className="border-[rgba(255,255,255,0.07)] bg-[#131315]"
                  >
                    <TableCell colSpan={5} className="w-full max-w-full p-0 whitespace-normal">
                      <div
                        className="min-w-0 overflow-hidden border-t border-[rgba(255,255,255,0.06)] pl-6 pr-6 pt-4 pb-4 transition-all duration-300 ease-out"
                        style={{
                          borderLeft: "2px solid rgba(240,112,112,0.4)",
                        }}
                      >
                        {loading[week.id] ? (
                          <div className="h-4 w-3/4 animate-pulse rounded bg-[rgba(240,239,232,0.2)] font-serif" />
                        ) : (
                          <>
                            <p
                              className="break-words font-serif text-[13px] leading-[1.7]"
                              style={{ color: "rgba(240,239,232,0.7)" }}
                            >
                              {reflections[week.id]}
                            </p>
                            <p className="mt-3 text-right text-[11px] text-[rgba(240,239,232,0.45)]">
                              Generated at time of miss
                            </p>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
