import { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function CustomOrderForm({ t, lang, onAdd, onClose }: any) {
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    onAdd({
      id: Date.now(),
      // الحفاظ على هيكل الـ name ككائن لغوي لكي لا يحدث خطأ في باقي التطبيق
      name: { 
        ar: details.trim(),
        en: details.trim(),
        [lang]: details.trim() 
      },
      price: Number(price) || 0,
      qty: 1,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
      isCustom: true,
    });
    onClose();
  };

  return (
    <Card className="border-yellow-200 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{t.customOrderTitle}</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">{t.customOrderDesc}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">التفاصيل والوصف</label>
            <Textarea 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              required 
              rows={4} 
              placeholder="اكتب تفاصيل طلبك هنا..." 
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.customOrderPrice} (اختياري)</label>
            <Input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="0" 
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700" 
            />
          </div>

          <Button 
            type="submit" 
            className="mt-2 w-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 py-6 text-base font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600"
          >
            <Send className="mx-2 h-5 w-5" />
            {t.addCustomToCart || "إضافة الطلب للسلة"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
