"use client";

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
import { MOCK_USER, MOCK_HISTORY, MOCK_DASHBOARD_STATS } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar
          variant="dashboard"
          userName={MOCK_USER.name.split(" ")[0]}
          streak={MOCK_DASHBOARD_STATS.streak}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-[#f0efe8]">History</h1>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            Your past weeks and penalties
          </p>
          <div className="mt-6 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] overflow-hidden">
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
                {MOCK_HISTORY.map((week) => (
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
