"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TIERS } from "@/lib/mock-data";
import type { Commitment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addPaymentMethod,
  deletePaymentMethod,
  deleteAccount,
  type AddCardInput,
  type CardBrand,
} from "@/app/actions/profile";
import { CreditCard, Plus, Trash2, AlertTriangle } from "lucide-react";

interface PaymentMethodDisplay {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
}

interface ProfileContentProps {
  fullName: string;
  email: string;
  commitment: Commitment;
  streak: number;
  paymentMethods: PaymentMethodDisplay[];
}

const CARD_BRANDS: { value: CardBrand; label: string }[] = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
];

function formatExpiry(month: number, year: number): string {
  const y = year >= 2000 ? year % 100 : year;
  return `${String(month).padStart(2, "0")}/${y}`;
}

function formatBrand(brand: string): string {
  return CARD_BRANDS.find((b) => b.value === brand)?.label ?? brand;
}

export function ProfileContent({
  fullName,
  email,
  commitment,
  streak,
  paymentMethods,
}: ProfileContentProps) {
  const tier = TIERS.find((t) => t.id === commitment.tierId);
  const firstName = fullName?.split(" ")[0] ?? "there";

  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addCardError, setAddCardError] = useState<string | null>(null);
  const [addCardLoading, setAddCardLoading] = useState(false);
  const [deleteCardLoading, setDeleteCardLoading] = useState<string | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

  const [last4, setLast4] = useState("");
  const [brand, setBrand] = useState<CardBrand>("visa");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCardError(null);
    setAddCardLoading(true);

    const month = parseInt(expMonth, 10);
    const year = parseInt(expYear, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      setAddCardError("Expiry month must be 1–12.");
      setAddCardLoading(false);
      return;
    }
    if (isNaN(year) || year < 20 || year > 99) {
      setAddCardError("Expiry year must be 20–99 (e.g. 28 for 2028).");
      setAddCardLoading(false);
      return;
    }

    const result = await addPaymentMethod({
      last4,
      brand,
      expMonth: month,
      expYear: year >= 50 ? 1900 + year : 2000 + year,
    });

    setAddCardLoading(false);
    if (result.error) {
      setAddCardError(result.error);
      return;
    }

    setLast4("");
    setExpMonth("");
    setExpYear("");
    setAddCardOpen(false);
  };

  const handleDeleteCard = async (id: string) => {
    setDeleteCardLoading(id);
    const result = await deletePaymentMethod(id);
    setDeleteCardLoading(null);
    if (result.error) {
      setAddCardError(result.error);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountError(null);
    setDeleteAccountLoading(true);
    const result = await deleteAccount();
    setDeleteAccountLoading(false);
    if (result.error) {
      setDeleteAccountError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar
          variant="dashboard"
          userName={firstName}
          streak={streak}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-[#f0efe8]">Profile</h1>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            Your account details
          </p>

          <div className="mt-8 space-y-6">
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f0efe8]">Account</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Name:</span>{" "}
                  {fullName || "—"}
                </p>
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Email:</span>{" "}
                  {email || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f0efe8]">Payment methods</h2>
              <p className="mt-1 text-sm text-[rgba(240,239,232,0.45)]">
                Cards used for penalties and subscriptions
              </p>

              <div className="mt-4 space-y-3">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-[rgba(240,239,232,0.6)]">
                    No cards on file
                  </p>
                ) : (
                  paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#131315] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="size-5 text-[rgba(240,239,232,0.5)]" />
                        <div>
                          <p className="font-mono text-sm text-[#f0efe8]">
                            •••• {pm.last4}
                          </p>
                          <p className="text-xs text-[rgba(240,239,232,0.45)]">
                            {formatBrand(pm.brand)} — expires{" "}
                            {formatExpiry(pm.exp_month, pm.exp_year)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-[rgba(240,239,232,0.5)] hover:text-[#f07070]"
                        onClick={() => handleDeleteCard(pm.id)}
                        disabled={deleteCardLoading === pm.id}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove card</span>
                      </Button>
                    </div>
                  ))
                )}

                <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[rgba(255,255,255,0.12)] text-[rgba(240,239,232,0.8)] hover:bg-[#131315]"
                      >
                        <Plus className="size-4" />
                        Add card
                      </Button>
                    }
                  />
                  <DialogContent
                    className="border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]"
                    showCloseButton={true}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-[#f0efe8]">
                        Add payment method
                      </DialogTitle>
                      <DialogDescription className="text-[rgba(240,239,232,0.6)]">
                        Enter the last 4 digits and expiry. Full card numbers are
                        never stored.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCard} className="space-y-4">
                      {addCardError && (
                        <p className="text-sm text-[#f07070]">{addCardError}</p>
                      )}
                      <div className="grid gap-2">
                        <Label
                          htmlFor="last4"
                          className="text-[rgba(240,239,232,0.8)]"
                        >
                          Last 4 digits
                        </Label>
                        <Input
                          id="last4"
                          placeholder="4242"
                          maxLength={4}
                          value={last4}
                          onChange={(e) =>
                            setLast4(e.target.value.replace(/\D/g, ""))
                          }
                          className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="brand"
                          className="text-[rgba(240,239,232,0.8)]"
                        >
                          Card brand
                        </Label>
                        <Select
                          value={brand}
                          onValueChange={(v) => setBrand(v as CardBrand)}
                        >
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
                          <Label
                            htmlFor="expMonth"
                            className="text-[rgba(240,239,232,0.8)]"
                          >
                            Month
                          </Label>
                          <Input
                            id="expMonth"
                            placeholder="12"
                            maxLength={2}
                            value={expMonth}
                            onChange={(e) =>
                              setExpMonth(e.target.value.replace(/\D/g, ""))
                            }
                            className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label
                            htmlFor="expYear"
                            className="text-[rgba(240,239,232,0.8)]"
                          >
                            Year
                          </Label>
                          <Input
                            id="expYear"
                            placeholder="28"
                            maxLength={2}
                            value={expYear}
                            onChange={(e) =>
                              setExpYear(e.target.value.replace(/\D/g, ""))
                            }
                            className="border-[rgba(255,255,255,0.12)] bg-[#131315] text-[#f0efe8]"
                          />
                        </div>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAddCardOpen(false)}
                          className="border-[rgba(255,255,255,0.12)]"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addCardLoading || last4.length !== 4}
                          className="bg-[#c8f060] text-[#0e0e10] hover:opacity-90"
                        >
                          {addCardLoading ? "Adding…" : "Add card"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f0efe8]">Current plan</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Tier:</span>{" "}
                  {tier?.name ?? "—"}
                </p>
                <p className="font-mono text-sm text-[#f0efe8]">
                  <span className="text-[rgba(240,239,232,0.45)]">Price:</span>{" "}
                  {tier ? `$${tier.priceMonthly.toFixed(2)}/mo` : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f07070]">Danger zone</h2>
              <p className="mt-1 text-sm text-[rgba(240,239,232,0.45)]">
                Permanently delete your account and all data. This cannot be
                undone.
              </p>

              <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
                <DialogTrigger
                  render={
                    <Button variant="destructive" size="sm" className="mt-4">
                      Delete account
                    </Button>
                  }
                />
                <DialogContent
                  className="border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]"
                  showCloseButton={true}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#f07070]">
                      <AlertTriangle className="size-5" />
                      Delete account
                    </DialogTitle>
                    <DialogDescription className="text-[rgba(240,239,232,0.6)]">
                      This will permanently delete your account, commitments,
                      sessions, and payment methods. You will be signed out and
                      redirected to the home page. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {deleteAccountError && (
                      <p className="text-sm text-[#f07070]">
                        {deleteAccountError}
                      </p>
                    )}
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteAccountOpen(false)}
                        className="border-[rgba(255,255,255,0.12)]"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteAccountLoading}
                      >
                        {deleteAccountLoading ? "Deleting…" : "Yes, delete my account"}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
