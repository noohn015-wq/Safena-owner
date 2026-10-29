import { MapPin, Phone, UtensilsCrossed, CheckCircle2, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderMap } from "@/components/OrderMap";

export function OrderDetails({ order, t }: { order: any; t: any }) {
  const rawStatus = order.status ? order.status.trim() : "قيد التحضير";

  const getStatusConfig = (status: string) => {
    if (status === "في الطريق" || status === "delivering" || status === "on_way") {
      return { label: t?.statusOnWay || "في الطريق", color: "bg-blue-100 text-blue-700", icon: Bike };
    }
    if (status === "تم التوصيل" || status === "completed" || status === "delivered") {
      return { label: t?.statusDelivered || "تم التوصيل", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 };
    }
    return { label: t?.statusPreparing || "قيد التحضير", color: "bg-amber-100 text-amber-700", icon: UtensilsCrossed };
  };

  const config = getStatusConfig(rawStatus);
  const StatusIcon = config.icon;

  const isDelivered = rawStatus === "تم التوصيل" || rawStatus === "completed" || rawStatus === "delivered";
  const isOnWay = rawStatus === "في الطريق" || rawStatus === "delivering" || rawStatus === "on_way" || isDelivered;

  const orderIdShort = order.id ? order.id.slice(-4) : (order.$id ? order.$id.slice(-4) : '0000');

  return (
    <div className="p-5" dir="rtl">
      {/* Order header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">رقم الطلب</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">#{orderIdShort}</h3>
        </div>
        <Badge className={`${config.color} border-0 px-3 py-1 font-medium`}>
          <StatusIcon className="ms-1 h-3.5 w-3.5" />
          {config.label}
        </Badge>
      </div>

      {/* Map */}
      <div className="mt-4 h-48 overflow-hidden rounded-xl">
        <OrderMap />
      </div>

      {/* Timeline */}
      <div className="mt-5">
        <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">مراحل الطلب</h4>
        <div className="space-y-1">
          {[
            { label: "تم استلام الطلب", done: true },
            { label: "قيد التحضير", done: true },
            { label: "السائق في الطريق", done: isOnWay },
            { label: "تم التوصيل", done: isDelivered },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${step.done ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${step.done ? "text-white" : "text-slate-400"}`} />
                </div>
                {i < arr.length - 1 && (
                  <div className={`mt-1 h-6 w-0.5 ${step.done ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                )}
              </div>
              <div className="pt-0.5">
                <p className={`text-sm font-medium ${step.done ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      {/* Customer info */}
      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">معلومات العميل</h4>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-yellow-100 text-xs font-bold text-yellow-700">
              {order.customerName || order.customer ? (order.customerName || order.customer).split(" ").map((n: string) => n[0]).join("") : "زب"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customerName || order.customer || "العميل"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">{order.phone || order.customer_phone}</p>
          </div>
          {(order.phone || order.customer_phone) && (
            <a href={`tel:${order.phone || order.customer_phone}`}>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700">
                <Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Delivery address */}
      <div className="mt-4">
        <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">عنوان التوصيل</h4>
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <p className="text-sm text-slate-600 dark:text-slate-300">{order.address || order.location || "العنوان بالتفصيل"}</p>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Order items / Total */}
      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">تفاصيل الفاتورة</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">الإجمالي</span>
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{order.total || 0} {t?.currency || "ل.س"}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex gap-2">
        <a href="https://wa.me/963959213962" target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full rounded-xl bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">
            تواصل معنا بخصوص الطلب
          </Button>
        </a>
      </div>
    </div>
  );
}
