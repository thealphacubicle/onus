import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WeekSummary } from "@/lib/types";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

async function getHistoryData(
  userId: string
): Promise<{ history: WeekSummary[]; userName: string; streak: number }> {
  const supabase = await createClient();

  try {
    const [sessionsRes, penaltiesRes, profileRes] = await Promise.all([
        supabase
          .from("sessions")
          .select("id, scheduled_date, checked_in, missed")
          .eq("user_id", userId)
          .order("scheduled_date", { ascending: false })
          .limit(500),
        supabase
          .from("penalties")
          .select("session_id, amount")
          .eq("user_id", userId),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .maybeSingle(),
      ]);

    const sessions = sessionsRes.data ?? [];
    const penalties = penaltiesRes.data ?? [];
    const penaltyBySession = new Map(
      penalties.map((p) => [p.session_id, Number(p.amount)])
    );

    const byWeek = new Map<
      string,
      {
        startDate: string;
        endDate: string;
        dateRange: string;
        completed: number;
        missed: number;
        penaltyTotal: number;
      }
    >();

    for (const s of sessions) {
      const monday = getMonday(new Date(s.scheduled_date));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const key = monday.toISOString().split("T")[0];

      if (!byWeek.has(key)) {
        byWeek.set(key, {
          startDate: key,
          endDate: sunday.toISOString().split("T")[0],
          dateRange: formatDateRange(monday, sunday),
          completed: 0,
          missed: 0,
          penaltyTotal: 0,
        });
      }

      const week = byWeek.get(key)!;
      if (s.checked_in) week.completed++;
      else if (s.missed) {
        week.missed++;
        week.penaltyTotal += penaltyBySession.get(s.id) ?? 0;
      }
    }

    const history: WeekSummary[] = Array.from(byWeek.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, w]) => ({
        id: key,
        dateRange: w.dateRange,
        startDate: w.startDate,
        endDate: w.endDate,
        sessionsCompleted: w.completed,
        sessionsMissed: w.missed,
        penaltiesCharged: w.penaltyTotal,
      }));

    let userName = "there";
    if (profileRes.data?.full_name) {
      userName = profileRes.data.full_name.split(" ")[0];
    }

    let streak = 0;
    const sortedWeeks = Array.from(byWeek.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [, w] of sortedWeeks) {
      const weekSessions = sessions.filter((s) => {
        const m = getMonday(new Date(s.scheduled_date));
        return m.toISOString().split("T")[0] === w.startDate;
      });
      const allDone = weekSessions.every((s) => s.checked_in);
      const anyMissed = weekSessions.some((s) => s.missed);
      if (allDone && !anyMissed) streak++;
      else break;
    }

    return { history, userName, streak };
  } catch {
    return { history: [], userName: "there", streak: 0 };
  }
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { history, userName, streak } = await getHistoryData(user.id);

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar variant="dashboard" userName={userName} streak={streak} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-[#f0efe8]">History</h1>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            Your past weeks and penalties
          </p>
          <div className="mt-6 overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
            <Table>
              <TableHeader>
                <TableRow className="border-[rgba(255,255,255,0.07)] hover:bg-transparent">
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
                {history.map((week) => (
                  <TableRow
                    key={week.id}
                    className="border-[rgba(255,255,255,0.07)] hover:bg-[#131315]"
                  >
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
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
