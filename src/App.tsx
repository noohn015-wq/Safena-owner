import './index.css'; 
import { useState, useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { HomePage } from "@/components/HomePage";
import { OrdersPage } from "@/components/OrdersPage";
import { ComplaintsPage } from "@/components/ComplaintsPage";
import { AccountPage } from "@/components/AccountPage";
import { BottomNav } from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Onboarding } from "@/components/Onboarding";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FlyingImage } from "@/components/FlyingImage";
import { SuccessModal } from "@/components/SuccessModal";
import { mockProducts } from "@/lib/data";
import { translations } from "@/lib/i18n";
import { databases, client, APPWRITE_DATABASE_ID, ORDERS_TABLE_ID } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

export type Lang = "ar" | "en";
export type Page = "home" | "orders" | "complaints" | "account";

export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [flyingImages, setFlyingImages] = useState<{ id: number; src: string; from: { x: number; y: number }; to?: { x: number; y: number } }[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

  const [showLangButton, setShowLangButton] = useState(true);
  const lastScrollTop = useRef(0);
  
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  const t = translations[lang];

  const fetchOrders = () => {
    if (!user?.phone) {
      setOrders([]);
      return;
    }

    databases.listDocuments(
      APPWRITE_DATABASE_ID,
      ORDERS_TABLE_ID,
      [
        Query.equal('customer_phone', user.phone),
        Query.orderDesc('$createdAt')
      ]
    ).then(response => {
      if (response.documents) {
        const appwriteOrders = response.documents.map((o: any) => ({
          id: o.$id,
          $id: o.$id,
          status: o.status || "preparing",
          rawStatus: o.status || "preparing",
          total: o.total || 0,
          customer: o.customer_name || o.customer || user?.name || "عميل",
          phone: o.customer_phone || o.phone || user?.phone || "",
          address: o.location || o.address || "",
          date: o.$createdAt ? o.$createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          $createdAt: o.$createdAt,
          items: typeof o.items === 'string' ? JSON.parse(o.items || "[]") : (o.items || []),
          location: o.location,
          deliveredTimer: o.status === 'delivered' ? (o.deliveredTimer || 60) : null,
        }));
        setOrders(appwriteOrders);
      }
    }).catch(error => {
      console.error("Error fetching orders from Appwrite:", error);
    });
  };

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("noah_user");
      const savedAddresses = localStorage.getItem("noah_addresses");
      
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));

      fetchOrders();

      const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${ORDERS_TABLE_ID}.documents`;
      const unsubscribe = client.subscribe(channel, (response) => {
        if (
          response.events.includes("databases.*.collections.*.documents.*.update") ||
          response.events.includes("databases.*.collections.*.documents.*.create") ||
          response.events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          fetchOrders();
        }
      });

      return () => {
        unsubscribe();
      };

    } catch (e) {
      console.error("Failed to load user data", e);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("noah_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (addresses.length > 0) localStorage.setItem("noah_addresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => {
        return prev.map(order => {
          const st = (order.status || order.rawStatus || "").trim().toLowerCase();
          
          if (st === "delivered" || st === "completed" || st === "تم التوصيل") {
            const orderKey = order.$id || order.id;
            
            const storageKey = `timer_start_${orderKey}`;
            let startTime = Number(localStorage.getItem(storageKey));

            if (!startTime || isNaN(startTime)) {
              startTime = Date.now();
              localStorage.setItem(storageKey, String(startTime));
            }

            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const remaining = 60 - elapsedSeconds;

            if (remaining <= 0) {
              localStorage.removeItem(storageKey);

              databases.deleteDocument(
                APPWRITE_DATABASE_ID,
                ORDERS_TABLE_ID,
                orderKey
              ).then(() => {
                console.log("Order deleted successfully from Appwrite");
              }).catch((err) => {
                console.error("Failed to delete order from Appwrite:", err);
              });

              return null;
            }

            return { ...order, deliveredTimer: remaining };
          }
          return order;
        }).filter(Boolean);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = e.currentTarget.scrollTop;
    if (st > lastScrollTop.current && st > 50) {
      setShowLangButton(false);
    } else {
      setShowLangButton(true);
    }
    lastScrollTop.current = st <= 0 ? 0 : st;
  };

  const handleOnboardingComplete = async (data: { name: string; phone: string; homeAddress: string }) => {
    const newUser = { name: data.name, phone: data.phone, homeAddress: data.homeAddress };
    setUser(newUser);
    setAddresses([{ id: Date.now(), label: t.home, details: data.homeAddress }]);

    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'visits',
        ID.unique(),
        {
          customer_name: data.name,
          customer_phone: data.phone,
          location: data.homeAddress || "العنوان الأساسي",
        }
      );
    } catch (error) {
      console.error("فشل تسجيل الزائر الجديد في جدول visits:", error);
    }
  };

  const handleAddToCart = (product: any, rect: DOMRect) => {
    const cartElement = cartRef.current;
    if (!cartElement) return;

    const cartRect = cartElement.getBoundingClientRect();
    const from = { x: rect.left, y: rect.top };
    const to = { x: cartRect.left, y: cartRect.top };
    
    const id = Date.now();
    setFlyingImages(prev => [...prev, { id, src: product.image, from, to }]);

    setTimeout(() => {
      setFlyingImages(prev => prev.filter(img => img.id !== id));
    }, 800);
  };

  const handleCheckoutConfirm = (location: string) => {
    setShowCheckout(false);
    setCart({});
    setShowSuccess(true);
    fetchOrders();
    setTimeout(() => {
      setShowSuccess(false);
      setPage("orders");
    }, 2000);
  };

  const pageIndex = getPageIndex(page);
  const translateXValue = pageIndex * 100;

  if (!user) {
    return (
      <div dir="rtl" className="bg-slate-950 text-white min-h-screen">
        <div className="relative mx-auto h-screen max-w-md overflow-hidden shadow-2xl shadow-[0_0_35px_rgba(249,115,22,0.35)]">
          <div className={`absolute left-4 top-4 z-50 transition-all duration-300 ${showLangButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
          <Onboarding t={t} onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = mockProducts.find(p => p.id === Number(id))!;
    return { name: product.name, qty, price: product.price };
  });
  
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div dir="rtl" className="bg-slate-950 text-white min-h-screen">
      <div className="relative mx-auto h-screen max-w-md overflow-hidden shadow-2xl shadow-[0_0_35px_rgba(249,115,22,0.35)]">
        
        <div className={`absolute left-4 top-4 z-50 transition-all duration-300 ${showLangButton ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <div 
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${translateXValue}%)` }}
        >
          <div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24" onScroll={handleScroll}>
            <HomePage 
              t={t} 
              lang={lang} 
              cart={cart} 
              setCart={setCart} 
              onCheckout={() => setShowCheckout(true)} 
              onAddToCart={handleAddToCart}
            />
          </div>
          <div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24" onScroll={handleScroll}>
            <OrdersPage t={t} lang={lang} user={user} orders={orders} setPage={setPage} />
          </div>
          <div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24" onScroll={handleScroll}>
            <ComplaintsPage t={t} lang={lang} user={user} />
          </div>
          <div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24" onScroll={handleScroll}>
            <AccountPage 
              t={t} 
              lang={lang} 
              user={user} 
              setUser={setUser} 
              addresses={addresses} 
              setAddresses={setAddresses} 
            />
          </div>
        </div>

        {showCheckout && (
          <CheckoutModal 
            t={t} 
            lang={lang} 
            user={user}
            addresses={addresses} 
            cartItems={cartItems}
            cartTotal={cartTotal}
            onClose={() => setShowCheckout(false)} 
            onConfirm={handleCheckoutConfirm}
          />
        )}

        {showSuccess && (
          <SuccessModal t={t} />
        )}

        {flyingImages.map((img) => (
          <FlyingImage 
            key={img.id} 
            src={img.src} 
            from={img.from} 
            to={img.to || img.from} 
            onComplete={() => setFlyingImages(prev => prev.filter(i => i.id !== img.id))}
          />
        ))}

        <div ref={cartRef} className="absolute bottom-4 end-4 z-[150] hidden">
          <ShoppingBag className="h-6 w-6 text-orange-500" />
        </div>

        <BottomNav page={page} setPage={setPage} t={t} />
      </div>
    </div>
  );
}

function getPageIndex(page: Page) {
  const order: Page[] = ["home", "orders", "complaints", "account"];
  return order.indexOf(page);
}
