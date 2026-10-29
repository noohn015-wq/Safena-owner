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
  { id: 1, category: "food", name: { ar: "بطاطا تشيز", en: "Cheesy Potatoes" }, price: 250, image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&q=80" },
  { id: 2, category: "food", name: { ar: "شاورما", en: "Shawarma" }, price: 30, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
  { id: 3, category: "food", name: { ar: "برغر", en: "Burger" }, price: 65, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 4, category: "food", name: { ar: "خبز سياحي صغير", en: "Small Touristic Bread" }, price: 75, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  { id: 5, category: "drinks", name: { ar: "مياه معدنية صغيرة", en: "Small Mineral Water" }, price: 30, image: "https://images.unsplash.com/photo-1560847468-5eef0e98839b?w=400&q=80" },
  { id: 6, category: "food", name: { ar: "سندويشة كريسبي", en: "Crispy Sandwich" }, price: 250, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80" },
  { id: 7, category: "food", name: { ar: "سندويشة سكالوب", en: "Escalope Sandwich" }, price: 250, image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&q=80" },
  { id: 8, category: "food", name: { ar: "سندويشة فاهيتا", en: "Fajita Sandwich" }, price: 300, image: "https://images.unsplash.com/photo-1619881590738-a111d1461446?w=400&q=80" },
  { id: 9, category: "food", name: { ar: "سندويشة فلافل", en: "Falafel Sandwich" }, price: 90, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80" },
  { id: 10, category: "drinks", name: { ar: "ببسي 1 لتر", en: "Pepsi 1L" }, price: 110, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80" },
  { id: 11, category: "drinks", name: { ar: "سفن اب 1 لتر", en: "7Up 1L" }, price: 100, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" },
  { id: 12, category: "food", name: { ar: "وجبة تشيكن صاب", en: "Chicken Sub Meal" }, price: 950, image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&q=80" },
  { id: 13, category: "food", name: { ar: "فروج مشوي", en: "Grilled Chicken" }, price: 1500, image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80" }
];
