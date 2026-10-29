import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 shadow-md shadow-amber-500/30", className)}>
      <span className="text-2xl font-extrabold tracking-tight text-slate-900">
        سفينة نوح
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800/80">
        Noah's Ark Delivery
      </span>
    </div>
  );
}