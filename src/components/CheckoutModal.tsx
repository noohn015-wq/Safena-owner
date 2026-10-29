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

      // 1. إرسال الطلب إلى جدول الطلبات (orders)
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        ORDERS_TABLE_ID,
        ID.unique(),
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          user_id: currentUserId,
          total: Number(cartTotal) || 0,
          items: formattedItems,
          location: location || "الموقع",
          status: "preparing"
        }
      );

      // 2. إرسال وتخزين بيانات الزائر فوراً إلى جدول الزوار (visits)
      try {
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          'visits', // معرف جدول الزوار
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
            className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition-transform hover:scale-105 hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="mx-1 h-4 w-4" />
            {t.sendOrder}
          </Button>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{t.selectLocation}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          <div className="flex gap-2 rounded-full bg-yellow-50 p-1 dark:bg-slate-700">
            <button
              className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", !isNew ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950" : "text-slate-500")}
              onClick={() => setIsNew(false)}
            >
              {t.savedLocations}
            </button>
            <button
              className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", isNew ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950" : "text-slate-500")}
              onClick={() => setIsNew(true)}
            >
              {t.newLocation}
            </button>
          </div>

          {!isNew ? (
            <div className="flex flex-col gap-2">
              {addresses.length === 0 ? (
                <p className="text-center text-sm text-slate-400">{t.noAddresses}</p>
              ) : (
                addresses.map((addr: any) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedLocation(addr.details)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 text-start transition-all",
                      selectedLocation === addr.details ? "border-orange-500 bg-orange-50/50 dark:bg-yellow-900/20" : "border-transparent bg-white dark:bg-slate-700"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-slate-600">
                      {addr.label.includes(t.home) || addr.label.toLowerCase().includes("home") ? <Home className="h-5 w-5 text-yellow-600" /> : <Briefcase className="h-5 w-5 text-yellow-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">{addr.label}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{addr.details}</p>
                    </div>
                    {selectedLocation === addr.details && <CheckCircle2 className="ms-auto h-5 w-5 text-orange-500" />}
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Textarea
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder={t.addressDetails}
                rows={4}
                className="rounded-xl dark:border-slate-600 dark:bg-slate-700"
              />
              <Button variant="outline" className="flex items-center justify-center gap-2 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-600">
                <Navigation className="h-4 w-4" /> تحديد على الخريطة
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="sticky bottom-0 z-[999] border-t border-yellow-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            className="w-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 py-6 text-base font-bold text-slate-950 shadow-md transition-transform hover:scale-[1.02] hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="mx-2 h-5 w-5" />
            {t.confirmAndSend}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
