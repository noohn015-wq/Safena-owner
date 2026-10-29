import { useState, useEffect } from "react";
import { Package, Bike, Phone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { databases, client, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";

export function OrdersPage({ t, lang, user, setPage, onSelectOrder }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveredTimers, setDeliveredTimers] = useState<{ [key: string]: number }>({});

  const fetchUserOrders = async () => {
    try {
      if (!user?.phone) {
        setOrders([]);
        setLoading(false);
        return;
      }

      let response;
      try {
        response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.ordersCollectionId,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(50)
          ]
        );
      } catch (err) {
        response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.ordersCollectionId,
          [Query.limit(50)]
        );
      }

      const userCleanPhone = String(user.phone).replace(/\D/g, "");
      const filteredOrders = response.documents.filter((doc: any) => {
        const orderId = doc.$id || doc.id;
        
        // إذا كان الطلب قد انتهى وقام المستخدم بحذفه سابقاً، لا نقوم بعرضه نهائياً حتى لو بقي في قاعدة البيانات
        const isExpiredLocally = localStorage.getItem(`expired_${orderId}`) === "true";
        if (isExpiredLocally) return false;

        const docPhone = String(doc.customer_phone || doc.phone || "").replace(/\D/g, "");
        if (!docPhone) return false;
        return docPhone.endsWith(userCleanPhone.slice(-9)) || userCleanPhone.endsWith(docPhone.slice(-9));
      });

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();

    const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.ordersCollectionId}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.update") ||
        response.events.includes("databases.*.collections.*.documents.*.create") ||
        response.events.includes("databases.*.collections.*.documents.*.delete")
      ) {
        fetchUserOrders();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // مؤقت دقيقة واحدة (60 ثانية) مع منع ظهوره بعد انتهائه نهائياً
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          const orderId = order.$id || order.id;
          
          // إذا كان الطلب منتهي مسبقاً، نزيله مباشرة
          if (localStorage.getItem(`expired_${orderId}`) === "true") {
            return null;
          }

          const st = (order.status || "").trim().toLowerCase();
          const isDelivered = st === "delivered" || st === "completed" || st === "تم التوصيل";

          if (isDelivered) {
            const storageKey = `timer_start_${orderId}`;
            let startTime = Number(localStorage.getItem(storageKey));

            if (!startTime || isNaN(startTime)) {
              startTime = Date.now();
              localStorage.setItem(storageKey, String(startTime));
            }

            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const remaining = 60 - elapsedSeconds;

            setDeliveredTimers(curr => ({ ...curr, [orderId]: remaining > 0 ? remaining : 0 }));

            if (remaining <= 0) {
              // تسجيل أن هذا الطلب انتهى نهائياً في الذاكرة لكي لا يعود أبداً عند الـ Refresh
              localStorage.setItem(`expired_${orderId}`, "true");
              localStorage.removeItem(storageKey);

              // محاولة حذفه من قاعدة البيانات في الخلفية
              databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.ordersCollectionId,
                orderId
              ).catch(err => console.error("Failed to delete expired order from server:", err));

              return null; // إزالة الطلب من الواجهة فوراً
            }
          }
          return order;
        }).filter(Boolean);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusInfo = (rawStatus: string) => {
    const status = rawStatus ? rawStatus.trim().toLowerCase() : "preparing";
    
    if (status === "onway" || status === "on_way" || status === "delivering" || status === "في الطريق") {
      return {
        label: t?.statusOnWay || "السائق في طريقه إليك",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      };
    }
    if (status === "delivered" || status === "completed" || status === "تم التوصيل") {
      return {
        label: t?.statusDelivered || "تم التوصيل",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      };
    }
    if (status === "cancelled" || status === "ملغي") {
      return {
        label: t?.statusCancelled || "ملغي",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      };
    }
    return {
      label: t?.statusPreparing || "قيد التحضير",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    };
  };

  const parseOrderItems = (itemsData: any) => {
    if (!itemsData) return [];
    try {
      if (typeof itemsData === 'string') {
        const parsed = JSON.parse(itemsData);
        return Array.isArray(parsed) ? parsed : [{ name: itemsData, qty: 1 }];
      }
      return Array.isArray(itemsData) ? itemsData : [itemsData];
    } catch (e) {
      return [{ name: String(itemsData), qty: 1 }];
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">جاري تحميل طلباتك...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-12 pb-24" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t?.orders || "طلباتي"}</h1>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Package className="h-16 w-16 text-yellow-400 dark:text-yellow-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t?.emptyOrders || "لا توجد طلبات سابقة"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t?.emptyOrdersDesc || "لم تقم بأي طلبات حتى الآن"}</p>
          </div>
          <Button onClick={() => setPage("home")} className="rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">
            {t?.startOrder || "ابدأ الطلب الان"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => {
            const statusInfo = getStatusInfo(order.status);
            const fullId = order.$id || order.id || "";
            const numericOnly = fullId.replace(/\D/g, "");
            const orderId = numericOnly.length >= 3 ? numericOnly.slice(-4) : Math.abs(fullId.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)).toString().slice(-4);
            
            const items = parseOrderItems(order.items);

            const st = (order.status || "").trim().toLowerCase();
            const isDelivered = st === "delivered" || st === "completed" || st === "تم التوصيل";
            let remainingText = "";
            if (isDelivered) {
              const currentOrderId = order.$id || order.id;
              const remaining = deliveredTimers[currentOrderId] !== undefined ? deliveredTimers[currentOrderId] : 60;
              const minutes = Math.floor(remaining / 60);
              const seconds = remaining % 60;
              remainingText = ` (يختفي خلال ${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
            }

            return (
              <Card 
                key={order.$id || order.id} 
                onClick={() => onSelectOrder && onSelectOrder(order)}
                className="border-yellow-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 cursor-pointer hover:border-yellow-400 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>رقم الطلب #{orderId}</span>
                      <ChevronLeft className="h-4 w-4 text-slate-400" />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                      {order.$createdAt ? new Date(order.$createdAt).toLocaleDateString() : ""}
                    </CardDescription>
                  </div>
                  <Badge className={cn("font-semibold border-0", statusInfo.color)}>
                    {statusInfo.label} {remainingText}
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="mb-3 flex flex-wrap gap-2 pt-2">
                    {items.length > 0 ? (
                      items.map((item: any, idx: number) => {
                        const itemName = typeof item.name === 'object' 
                          ? (item.name[lang] || item.name.ar || item.name.en || "وجبة") 
                          : (item.name || "وجبة");
                        return (
                          <Badge key={idx} variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                            {item.qty || 1}x {itemName}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-500">تفاصيل الطلب مسجلة</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                    <span>{items.length > 0 ? `${items.length} أصناف` : "التفاصيل"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{order.total} ل.س</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
