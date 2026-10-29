import { MapPin, Navigation, Bike, UtensilsCrossed } from "lucide-react";

export function OrderMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-800">
      {/* Map background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />

      {/* Grid lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Roads */}
      <div className="absolute left-0 top-1/3 h-1 w-full -rotate-12 bg-slate-600/50" />
      <div className="absolute left-1/4 top-0 h-full w-1 rotate-6 bg-slate-600/50" />
      <div className="absolute left-2/3 top-0 h-full w-1 -rotate-3 bg-slate-600/50" />

      {/* Route path */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path
          d="M 80 280 Q 200 200 300 240 T 520 120"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray="8 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Restaurant marker */}
      <div className="absolute" style={{ left: "15%", top: "65%" }}>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 shadow-lg shadow-orange-500/40 ring-4 ring-orange-600/20">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-orange-600" />
        </div>
      </div>

      {/* Driver marker (moving) */}
      <div className="absolute animate-pulse" style={{ left: "45%", top: "45%" }}>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/40 ring-4 ring-blue-600/20">
            <Bike className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-blue-600" />
        </div>
      </div>

      {/* Customer marker */}
      <div className="absolute" style={{ left: "80%", top: "22%" }}>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-600/20">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-emerald-600" />
        </div>
      </div>

      {/* ETA badge */}
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-slate-900/80 px-3 py-2 backdrop-blur-sm">
        <Navigation className="h-4 w-4 text-orange-400" />
        <div>
          <p className="text-xs text-slate-400">الوقت المتبقي</p>
          <p className="text-sm font-bold text-white">12 دقيقة</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 space-y-1.5 rounded-xl bg-slate-900/80 px-3 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          <span className="text-xs text-slate-300">المطعم</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-300">السائق</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-300">العميل</span>
        </div>
      </div>
    </div>
  );
}
