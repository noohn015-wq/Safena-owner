import { useState } from "react"; 
import { Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockCategories, mockProducts } from "@/lib/data";
import { CustomOrderForm } from "@/components/CustomOrderForm";

export function HomePage({ t, lang, cart, setCart, onCheckout, onAddToCart }: any) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const addToCart = (id: number) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  const removeFromCart = (id: number) => {
    const newCart = { ...cart };
    if (newCart[id] > 1) newCart[id]--;
    else delete newCart[id];
    setCart(newCart);
  };

  const handleAddCustom = (item: any) => {
    setCart({ ...cart, [item.id]: (cart[item.id] || 0) + item.qty });
    mockProducts.push(item);
    setActiveCategory(null);
  };

  const cartCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum: number, [id, qty]: [string, any]) => {
    const product = mockProducts.find((p) => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const filteredProducts = activeCategory ? mockProducts.filter(p => p.category === activeCategory) : mockProducts;

  // جلب اسم التصنيف النشط حالياً لعرضه في العنوان
  const currentCategoryObj = mockCategories.find(c => c.id === activeCategory);
  const sectionTitle = currentCategoryObj ? t[currentCategoryObj.labelKey] : t.popular;

  // ترتيب التصنيفات بحيث يتم جلب تصنيف الطلب اليدوي "custom" ليكون في البداية
  const sortedCategories = [...mockCategories].sort((a, b) => {
    if (a.id === "custom") return -1;
    if (b.id === "custom") return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 p-4 pt-6 pb-32">
      <header className="flex items-center justify-between pt-4" dir="rtl">
        <img 
          src="/logo.png" 
          alt="سفينة نوح" 
          className="h-32 w-auto object-contain drop-shadow-sm" 
        />
        <div className="flex flex-col items-start">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.tagline}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.categories}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sortedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === "custom") {
                  setShowCustomForm(true);
                } else {
                  setActiveCategory(activeCategory === cat.id ? null : cat.id);
                }
              }}
              className={cn(
                "flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl shadow-sm transition-all bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold",
                activeCategory === cat.id 
                  ? "shadow-inner scale-95 ring-2 ring-orange-600 dark:ring-orange-400" 
                  : "hover:opacity-90"
              )}
            >
              <cat.icon className="h-8 w-8 mb-1" />
              <span className="text-xs font-semibold">{t[cat.labelKey]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{sectionTitle}</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-800">
              <CardContent className="p-0">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={product.image} alt={product.name[lang]} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{product.name[lang]}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-orange-500 text-sm">{product.price} {t.currency}</span>
                    {cart[product.id] ? (
                      <div className="flex items-center justify-center gap-1.5 w-full mt-1">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 rounded-xl border-red-500/30 bg-gradient-to-br from-red-500 to-rose-600 p-0 text-white shadow-md hover:from-red-600 hover:to-rose-700" 
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-6 text-center text-sm font-bold text-slate-800 dark:text-white">{cart[product.id]}</span>
                        <Button 
                          size="icon" 
                          className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0 text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600 font-bold" 
                          onClick={(e) => {
                            addToCart(product.id);
                            onAddToCart(product, e.currentTarget.getBoundingClientRect());
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-0 text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600 font-bold" 
                        onClick={(e) => {
                          addToCart(product.id);
                          onAddToCart(product, e.currentTarget.getBoundingClientRect());
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <Card className="fixed bottom-20 left-4 right-4 z-40 border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-xl">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-slate-400">{cartCount} {t.items}</p>
              <p className="text-base font-bold text-orange-400 font-mono">{cartTotal} {t.currency}</p>
            </div>
            <Button 
              onClick={onCheckout} 
              className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold shadow-md hover:from-amber-500 hover:to-orange-600 px-6"
            >
              {t.checkout} 
            </Button>
          </CardContent>
        </Card>
      )}

      {showCustomForm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <CustomOrderForm t={t} lang={lang} onAdd={handleAddCustom} onClose={() => setShowCustomForm(false)} />
        </div>
      )}
    </div>
  );
}
