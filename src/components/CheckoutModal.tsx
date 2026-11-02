import { useState } from "react";
import { CheckCircle2, Home, Briefcase, Navigation, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { databases, account, APPWRITE_DATABASE_ID, ORDERS_TABLE_ID } from "@/lib/appwrite";
import { ID } from "appwrite";
import { cn } from "@/lib/utils";

export function CheckoutModal({ t, lang, user, addresses, onClose, onConfirm, cartItems, cartTotal }: any) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const location = isNew ? newLocation.trim() : selectedLocation;
    if (!location) return;

    setIsSubmitting(true);

    try {
      let currentUserId = user?.$id || user?.id || "guest";
      try {
        if (!user?.$id && !user?.id) {
          const currentUser = await account.get();
          if (currentUser?.$id) currentUserId = currentUser.$id;
        }
      } catch (e) {
        // تجاهل خطأ الجلسة
      }

      const formattedItems = (cartItems || []).map((item: any) => {
        const nameVal = typeof item.name === 'object' ? (item.name?.ar || item.name?.en || '') : (item.name || item.title || '');
        const qty = item.qty || item.quantity || 1;
        return `${nameVal} (x${qty})`;
      }).filter(Boolean).join(' / ');

      const customerName = user?.name || user?.fullName || "عميل";
      const customerPhone = user?.phone || user?.phoneNumber || "00000000";

      // توليد معرف فريد للطلب واستخدامه
      const orderIdDoc = ID.unique();

      // 1. إرسال الطلب إلى جدول الطلبات (orders)
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        ORDERS_TABLE_ID,
        orderIdDoc,
        {
          order_id: orderIdDoc,
          customer_name: customerName,
          customer_phone: customerPhone,
          user_id: currentUserId,
          total: Number(cartTotal) || 0,
          items: formattedItems,
          location: location || "الموقع",
          status: "pending"
        }
      );

      // 2. إرسال وتخزين بيانات الزائر فوراً باستخدام المعرف الحقيقي لجدول visits
      try {
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          '6ae8fb0c002bf0f1ecad',
          ID.unique(),
          {
            customer_name: customerName,
            customer_phone: customerPhone,
            location: location || "الموقع",
          }
        );
      } catch (visitErr) {
        console.error("فشل تسجيل الزائر في جدول visits:", visitErr);
      }

      setIsSubmitting(false);
      onConfirm(location);
    } catch (error: any) {
      console.error("Error details:", error);
      alert("السبب الحقيقي: " + (error?.message || JSON.stringify(error)));
      setIsSubmitting(false);
    }
  };

  const isDisabled = (!isNew && !selectedLocation) || (isNew && !newLocation.trim()) || isSubmitting;

  return (
    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <Card className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border-yellow-200 p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            className="rounded-full
