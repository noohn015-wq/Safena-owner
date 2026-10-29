import { useState } from "react";
import { User, Navigation, Package, MessageSquareWarning, ArrowRight, Pencil, Trash2, Home, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { databases, APPWRITE_DATABASE_ID } from "@/lib/appwrite"; // <--- استيراد مكتبة قاعدة البيانات
import { ID } from "appwrite"; // <--- استيراد مُعرّف المعرفات الفريدة

export function AccountPage({ t, lang, user, setUser, addresses, setAddresses }: any) {
  const [view, setView] = useState<"main" | "edit" | "addresses" | "help">("main");

  if (view === "edit") return <EditProfileView t={t} user={user} setUser={setUser} onBack={() => setView("main")} />;
  if (view === "addresses") return <AddressesView t={t} lang={lang} addresses={addresses} setAddresses={setAddresses} onBack={() => setView("main")} />;
  if (view === "help") return <HelpView t={t} onBack={() => setView("main")} />;

  const menuItems = [
    { id: "edit" as const, icon: User, label: t.editProfile },
    { id: "addresses" as const, icon: Navigation, label: t.addresses },
    { id: "payment" as const, icon: Package, label: t.paymentMethods },
    { id: "help" as const, icon: MessageSquareWarning, label: t.helpCenter },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.account}</h1>
      
      {/* بطاقة معلومات الحساب بلون خلفية متناسق */}
      <div className="flex items-center gap-4 rounded-2xl bg-slate-800 p-4 shadow-sm border border-slate-700/50">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xl font-bold text-slate-950 shadow-md">
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col text-start">
          <p className="text-xs text-slate-400">{t.welcomeBack}</p>
          <h2 className="text-base font-bold text-white">{user.name}</h2>
          <p className="text-xs text-slate-400" dir="ltr">{user.phone}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => item.id !== "payment" && setView(item.id)} 
            className="flex items-center justify-between rounded-xl bg-white p-4 text-start shadow-sm transition-colors hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-slate-700">
                <item.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 rtl:rotate-180" />
          </button>
        ))}
      </div>
    </div>
  );
}

function EditProfileView({ t, user, setUser, onBack }: any) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [homeAddress, setHomeAddress] = useState(user.homeAddress);
  const [updated, setUpdated] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, name, phone, homeAddress });

    // إرسال البيانات المحدثة أو تسجيلها مباشرة في جدول visits
    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'visits', // اسم جدول الزوار في قاعدة البيانات
        ID.unique(),
        {
          customer_name: name,
          customer_phone: phone,
          location: homeAddress || "غير محدد",
        }
      );
    } catch (err) {
      console.error("فشل إرسال بيانات التحديث إلى جدول visits:", err);
    }

    setUpdated(true);
    setTimeout(onBack, 1500);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.editProfileTitle}</h1>
      </div>
      {updated ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <p className="font-semibold text-green-700 dark:text-green-400">{t.profileUpdated}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.fullName}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.phoneNumber}</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.homeAddress}</label>
                <Textarea value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required rows={3} className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              </div>
              <Button type="submit" className="mt-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 py-6 text-base font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600">{t.save}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddressesView({ t, lang, addresses, setAddresses, onBack }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [details, setDetails] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([...addresses, { id: Date.now(), label, details }]);
    setLabel("");
    setDetails("");
    setShowForm(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses(addresses.map((addr: any) => addr.id === editingId ? { ...addr, label, details } : addr));
    setLabel("");
    setDetails("");
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm(t.deleteAddressConfirm)) {
      setAddresses(addresses.filter((addr: any) => addr.id !== id));
    }
  };

  const startEdit = (addr: any) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setDetails(addr.details);
    setShowForm(false);
  };

  const isFormOpen = showForm || editingId !== null;

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.addresses}</h1>
        </div>
        {!isFormOpen && (
          <Button size="sm" className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold shadow-md hover:from-amber-500 hover:to-orange-600" onClick={() => setShowForm(true)}>
            <Plus className="me-1 h-4 w-4" /> {t.addAddress}
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <Card className="border-orange-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={editingId !== null ? handleEdit : handleAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.addressLabel}</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} required placeholder={t.home} className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.addressDetails}</label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={3} className="rounded-xl border-slate-200 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600">{t.save}</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-full text-slate-700 dark:text-slate-200 dark:border-slate-600" 
                  onClick={() => { setShowForm(false); setEditingId(null); setLabel(""); setDetails(""); }}
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Navigation className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="text-slate-500 dark:text-slate-400">{t.noAddresses}</p>
            </div>
          ) : (
            addresses.map((addr: any) => (
              <Card key={addr.id} className="border-orange-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    {addr.label.includes(t.home) || addr.label.toLowerCase().includes("home") ? <Home className="h-5 w-5 text-orange-600" /> : <Briefcase className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{addr.label}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{addr.details}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-orange-100 dark:hover:bg-slate-700" onClick={() => startEdit(addr)}>
                      <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function HelpView({ t, onBack }: any) {
  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.helpCenter}</h1>
      </div>
      <Card className="border-none bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm dark:from-green-900/10 dark:to-emerald-900/10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-green-500" width="24" height="24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{t.whatsappSupport}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white" dir="ltr">{t.whatsappNumber}</p>
          <a href="https://wa.me/963959213962" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white">
              {t.whatsappSupport}
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
