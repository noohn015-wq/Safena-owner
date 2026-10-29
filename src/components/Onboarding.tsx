import { useState } from "react";
import { Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Onboarding({ t, onComplete }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (value.length > 0 && !value.startsWith("09")) {
      setError(t.phoneError);
    } else if (value.length > 10) {
      setError(t.phoneError);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.startsWith("09") || phone.length !== 10) {
      setError(t.phoneError);
      return;
    }
    onComplete({ name, phone, homeAddress });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 p-6 dark:from-slate-900 dark:to-slate-800">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/30">
          <Bike className="h-10 w-10 text-slate-800" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.welcomeTitle}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.welcomeDesc}</p>
        </div>
      </div>
      <Card className="w-full border-yellow-200 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.fullName}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.welcomeNamePlaceholder} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.phoneNumber}</label>
              <Input 
                type="tel" 
                value={phone} 
                onChange={handlePhoneChange} 
                required 
                placeholder="09xxxxxxxx" 
                className={cn("rounded-xl dark:border-slate-600 dark:bg-slate-700", error && "border-red-500 focus-visible:ring-red-500")} 
                pattern="[0-9]*" 
                inputMode="numeric"
                maxLength={10}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.homeAddress}</label>
              <Textarea value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required placeholder={t.welcomeAddressPlaceholder} rows={3} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <Button type="submit" className="mt-2 rounded-full bg-yellow-400 py-6 text-base font-bold text-slate-800 hover:bg-yellow-500">
              {t.startUsing}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}