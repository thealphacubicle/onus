"use client";

import { MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_GOAL_BUILDER_MESSAGES } from "@/lib/mock-data";

export function GoalBuilder() {
  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
      <div className="flex h-80 flex-col gap-4 overflow-y-auto">
        {MOCK_GOAL_BUILDER_MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                msg.role === "ai"
                  ? "bg-[#c8f060]/20 text-[#c8f060]"
                  : "bg-[#131315] text-[rgba(240,239,232,0.6)]"
              )}
            >
              {msg.role === "ai" ? (
                <MessageCircle className="size-4" />
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                msg.role === "ai"
                  ? "bg-[#131315] text-[#f0efe8]"
                  : "bg-[rgba(200,240,96,0.15)] text-[#f0efe8]"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[rgba(240,239,232,0.45)]">
        AI goal builder — mocked for demo. Real AI coming soon.
      </p>
    </div>
  );
}
