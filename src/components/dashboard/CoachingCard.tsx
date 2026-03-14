"use client";

import { MessageCircle } from "lucide-react";

interface CoachingCardProps {
  message: string;
}

export function CoachingCard({ message }: CoachingCardProps) {
  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
      <div className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#c8f060]/20">
          <MessageCircle className="size-5 text-[#c8f060]" />
        </div>
        <div>
          <h3 className="font-medium text-[#f0efe8]">Weekly coaching</h3>
          <p className="mt-2 text-sm text-[rgba(240,239,232,0.8)]">{message}</p>
        </div>
      </div>
    </div>
  );
}
