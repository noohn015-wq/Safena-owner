import { UtensilsCrossed, Coffee, Pizza, Drumstick, IceCream, Soup, Fish, Croissant } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const menuCategories = [
  { name: "وجبات رئيسية", icon: UtensilsCrossed, count: 24, color: "bg-yellow-100 text-yellow-700", desc: "أطباق مشبعة ومتنوعة" },
  { name: "مشروبات", icon: Coffee, count: 18, color: "bg-blue-100 text-blue-600", desc: "عصائر ومشروبات ساخنة وباردة" },
  { name: "بيتزا", icon: Pizza, count: 12, color: "bg-rose-100 text-rose-600", desc: "إيطالية بنكهات مختلفة" },
  { name: "دجاج", icon: Drumstick, count: 15, color: "bg-amber-100 text-amber-600", desc: "مشوي ومقلي وبلحم البقر" },
  { name: "حلويات", icon: IceCream, count: 9, color: "bg-pink-100 text-pink-600", desc: "آيس كريم وحلويات شرقية" },
  { name: "شوربات", icon: Soup, count: 6, color: "bg-teal-100 text-teal-600", desc: "شوربات ساخنة ومنعشة" },
  { name: "مأكولات بحرية", icon: Fish, count: 8, color: "bg-cyan-100 text-cyan-600", desc: "سمك وروبيان طازجة" },
  { name: "مخبوزات", icon: Croissant, count: 11, color: "bg-orange-100 text-orange-600", desc: "خبز ومعجنات طازجة" },
];

export function MenuPage() {
  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">تصفح القائمة</h1>
        <p className="text-sm text-slate-500">اختر فئة لاستكشاف الأطباق المتاحة</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {menuCategories.map((cat) => (
          <Card key={cat.name} className="cursor-pointer rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <CardContent className="p-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color}`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{cat.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{cat.desc}</p>
              <p className="mt-2 text-xs font-medium text-slate-400">{cat.count} طبق متاح</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
