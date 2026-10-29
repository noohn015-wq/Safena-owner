import { ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SuccessModal({ t }: any) {
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-4 border-yellow-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <ChefHat className="h-10 w-10 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.orderPreparing}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.orderPreparingDesc}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}