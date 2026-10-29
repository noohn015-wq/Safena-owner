import { Home, ClipboardList, MessageSquareWarning, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({ page, setPage, t }: any) {
  const items = [
    { id: "home", icon: Home, label: t.home },
    { id: "orders", icon: ClipboardList, label: t.orders },
    { id: "complaints", icon: MessageSquareWarning, label: t.complaints },
    { id: "account", icon: User, label: t.account },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-800 bg-slate-900 py-3 text-white">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-yellow-400" : "text-slate-400 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}