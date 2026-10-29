import { useState } from "react";
import { Search, ShoppingCart, Plus, Star, Flame, Leaf, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products, categories } from "@/lib/data";

export function ShoppingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const cartCount = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="relative min-h-full">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 px-5 pb-20 pt-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-100">توصيل سريع إلى</p>
            <div className="flex items-center gap-1 font-bold">
              <MapPin className="h-4 w-4" />
              <span>الرياض، حي النخيل</span>
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">ماذا تريد أن تطلب اليوم؟</h1>
        <p className="mt-1 text-yellow-100">اختر من أشهى الأطباق وسيصل إليك خلال 30 دقيقة</p>
        
        <div className="relative mt-6">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="ابحث عن مطعم، طبق، أو مشروب..."
            className="h-12 rounded-2xl border-0 bg-white pr-12 text-sm shadow-lg shadow-amber-900/10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="-mt-12 px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "border-yellow-500 bg-white text-yellow-600 shadow-md shadow-yellow-500/10"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Products Grid */}
      <div className="mt-6 px-4">
        <h2 className="mb-4 text-lg font-bold text-slate-900">الأطباق الرائجة</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="relative h-32 overflow-hidden bg-slate-100">
                <div className={`absolute inset-0 ${product.bgGradient}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <product.icon className="h-16 w-16 text-white/90 drop-shadow-lg" />
                </div>
                {product.badge && (
                  <Badge className="absolute right-2 top-2 border-0 bg-white/90 text-xs font-bold text-yellow-600 shadow-sm">
                    {product.badge === "hot" ? <Flame className="ml-1 h-3 w-3" /> : <Leaf className="ml-1 h-3 w-3" />}
                    {product.badge === "hot" ? "حار" : "جديد"}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="truncate text-sm font-bold text-slate-900">{product.name}</h3>
                <p className="mt-0.5 truncate text-xs text-slate-500">{product.restaurant}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-slate-600">{product.rating}</span>
                  <span className="text-xs text-slate-400">· {product.time} د</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-yellow-600">{product.price} ر.س</span>
                  <Button
                    size="icon"
                    onClick={() => addToCart(product.id)}
                    className="h-8 w-8 rounded-lg bg-yellow-500 text-white shadow-sm hover:bg-yellow-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between rounded-2xl bg-slate-900 p-4 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-slate-900">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400">{cartCount} عناصر في السلة</p>
                <p className="font-bold">{cartTotal.toFixed(2)} ر.س</p>
              </div>
            </div>
            <Button className="rounded-xl bg-yellow-500 text-slate-900 hover:bg-yellow-400">
              عرض السلة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
