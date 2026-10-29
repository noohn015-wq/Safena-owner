import { Pizza, Shirt, Coffee, Smartphone, Dumbbell, PencilLine } from "lucide-react";

export const mockCategories = [
  { id: "food", icon: Pizza, labelKey: "catFood" as const },
  { id: "clothes", icon: Shirt, labelKey: "catClothes" as const },
  { id: "drinks", icon: Coffee, labelKey: "catDrinks" as const },
  { id: "electronics", icon: Smartphone, labelKey: "catElectronics" as const },
  { id: "sports", icon: Dumbbell, labelKey: "catSports" as const },
  { id: "custom", icon: PencilLine, labelKey: "catCustom" as const },
];

export const mockProducts = [
  { id: 1, category: "food", name: { ar: "تشيز برجر", en: "Cheese Burger" }, price: 35, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 2, category: "food", name: { ar: "بيبروني بيتزا", en: "Pepperoni Pizza" }, price: 45, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 3, category: "food", name: { ar: "كنتاكي وجبة", en: "Chicken Meal" }, price: 30, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80" },
  { id: 4, category: "food", name: { ar: "سلطة سيزر", en: "Caesar Salad" }, price: 25, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
  { id: 5, category: "clothes", name: { ar: "تيشيرت قطن", en: "Cotton T-Shirt" }, price: 50, image: "https://images.unsplash.com/photo-1521572163474-6564e9c4ee99?w=400&q=80" },
  { id: 6, category: "clothes", name: { ar: "بنطال جينز", en: "Jeans" }, price: 80, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80" },
  { id: 7, category: "clothes", name: { ar: "حذاء رياضي", en: "Sneakers" }, price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: 8, category: "clothes", name: { ar: "جاكيت شتوي", en: "Winter Jacket" }, price: 150, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80" },
  { id: 9, category: "drinks", name: { ar: "آيس كوفي", en: "Iced Coffee" }, price: 15, image: "https://images.unsplash.com/photo-1461023058943-073be3382d5f?w=400&q=80" },
  { id: 10, category: "drinks", name: { ar: "عصير برتقال", en: "Orange Juice" }, price: 20, image: "https://images.unsplash.com/photo-1600271886736-36f77b5b85e1?w=400&q=80" },
  { id: 11, category: "drinks", name: { ar: "موكا ساخن", en: "Hot Mocha" }, price: 18, image: "https://images.unsplash.com/photo-1572442388184-a8c0158ff5f9?w=400&q=80" },
  { id: 12, category: "drinks", name: { ar: "ماء معدني", en: "Mineral Water" }, price: 5, image: "https://images.unsplash.com/photo-1560847468-5eef0e98839b?w=400&q=80" },
  { id: 13, category: "electronics", name: { ar: "سماعات بلوتوث", en: "Bluetooth Headphones" }, price: 200, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: 14, category: "electronics", name: { ar: "شاحن سريع", en: "Fast Charger" }, price: 35, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80" },
  { id: 15, category: "electronics", name: { ar: "ساعة ذكية", en: "Smart Watch" }, price: 300, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80" },
  { id: 16, category: "electronics", name: { ar: "ماوس لاسلكي", en: "Wireless Mouse" }, price: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 17, category: "sports", name: { ar: "كرة قدم", en: "Soccer Ball" }, price: 60, image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=400&q=80" },
  { id: 18, category: "sports", name: { ar: "دمبل حديد", en: "Dumbbell" }, price: 90, image: "https://images.unsplash.com/photo-1583454113551-9f392e119c58?w=400&q=80" },
  { id: 19, category: "sports", name: { ar: "حبل قفز", en: "Jump Rope" }, price: 15, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80" },
  { id: 20, category: "sports", name: { ar: "زجاجة ماء", en: "Water Bottle" }, price: 10, image: "https://images.unsplash.com/photo-1603002609090-772b67b2da78?w=400&q=80" },
];