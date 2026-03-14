"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPaymentMethod, type CardBrand } from "@/app/actions/profile";

const CARD_BRANDS: { value: CardBrand; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
];

interface AddCardFormProps {
  onSuccess?: () => void;
  redirectOnSuccess?: string;
}

export function AddCardForm({ onSuccess, redirectOnSuccess }: AddCardFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [last4, setLast4] = useState("");
  const [brand, setBrand] = useState<CardBrand>("visa");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const month = parseInt(expMonth, 10);
    const year = parseInt(expYear, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      setError("Expiry month must be 1–12.");
      setLoading(false);
      return;
    }
    if (isNaN(year) || year < 20 || year > 99) {
      setError("Expiry year must be 20–99 (e.g. 28 for 2028).");
      setLoading(false);
      return;
    }

    const result = await addPaymentMethod({
      last4,
      brand,
      expMonth: month,
      expYear: year >= 50 ? 1900 + year : 2000 + year,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (redirectOnSuccess) {
      router.push(redirectOnSuccess);
      router.refresh();
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-[#f07070]">{error}</p>}
      <div className="grid gap-2">
        <Label htmlFor="last4" className="text-[rgba(240,239,232,0.8)]">
          Last 4 digits
        </Label>
        <Input
          id="last4"
          placeholder="4242"
          maxLength={4}
          value={last4}
          onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))}
          className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="brand" className="text-[rgba(240,239,232,0.8)]">
          Card brand
        </Label>
        <Select value={brand} onValueChange={(v) => setBrand(v as CardBrand)}>
          <SelectTrigger
            id="brand"
            className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
            {CARD_BRANDS.map((b) => (
              <SelectItem
                key={b.value}
                value={b.value}
                className="text-[#f0efe8]"
              >
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="expMonth" className="text-[rgba(240,239,232,0.8)]">
            Month
          </Label>
          <Input
            id="expMonth"
            placeholder="12"
            maxLength={2}
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, ""))}
            className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="expYear" className="text-[rgba(240,239,232,0.8)]">
            Year
          </Label>
          <Input
            id="expYear"
            placeholder="28"
            maxLength={2}
            value={expYear}
            onChange={(e) => setExpYear(e.target.value.replace(/\D/g, ""))}
            className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading || last4.length !== 4}
        className="w-full bg-[#c8f060] text-[#0e0e10] hover:opacity-90"
      >
        {loading ? "Adding…" : "Add card"}
      </Button>
    </form>
  );
}
