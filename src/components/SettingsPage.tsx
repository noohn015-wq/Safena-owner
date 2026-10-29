import { useState } from "react";
import { Bell, Globe, Moon, Shield, HelpCircle, LogOut, ChevronLeft, Truck, MapPin, Phone, Wallet, Banknote, CheckCircle2, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TranslationKeys, Language } from "@/types/i18n";

export function SettingsPage({ t, lang, setLang, isDarkMode, setIsDarkMode }: { 
  t: TranslationKeys; 
  lang: Language;
  setLang: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState("shamcash");

  const settingsGroups = [
    {
      title: t.settings.account,
      items: [
        { icon: Truck, label: t.settings.addresses, desc: t.settings.addressesDesc },
      ],
    },
    {
      title: t.settings.preferences,
      items: [
        { icon: Bell, label: t.settings.notifications, desc: t.settings.notificationsDesc, toggle: true, defaultOn: true },
        { icon: Globe, label: t.settings.language, desc: t.settings.languageDesc, isLanguage: true },
        { icon: Moon, label: t.settings.darkMode, desc: t.settings.darkModeDesc, isDarkMode: true },
      ],
    },
    {
      title: t.settings.support,
      items: [
        { icon: Shield, label: t.settings.privacy, desc: t.settings.privacyDesc },
        { icon: HelpCircle, label: t.settings.help, desc: t.settings.helpDesc },
      ],
    },
  ];

  return (
    <div className="p-5 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.settings.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t.settings.subtitle}</p>
      </div>

      <Card className="mb-6 overflow-hidden rounded-2xl border-slate-200 bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md">
        <CardContent className="p-5 text-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-lg font-bold text-white">ع‌أ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{lang === "ar" ? "عبدالله الأحمد" : "Abdullah Al-Ahmad"}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-yellow-50">
                <Phone className="h-3.5 w-3.5" />
                <span>+966 55 123 4567</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-yellow-50">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t.home.location}</span>
              </div>
            </div>
            <Button variant="secondary" className="rounded-xl bg-white/20 text-white hover:bg-white/30">
              {t.settings.edit}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-3 px-1 text-sm font-bold text-slate-500 dark:text-slate-400">{t.settings.paymentMethods}</h2>
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-5">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-3">
              <Label
                htmlFor="shamcash"
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                  paymentMethod === "shamcash" 
                    ? "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 dark:bg-yellow-900/20" 
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${paymentMethod === "shamcash" ? "bg-yellow-100" : "bg-slate-100 dark:bg-slate-700"}`}>
                  <Wallet className={`h-6 w-6 ${paymentMethod === "shamcash" ? "text-yellow-600" : "text-slate-600 dark:text-slate-300"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{t.settings.shamcash}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.settings.shamcashDesc}</p>
                </div>
                <RadioGroupItem value="shamcash" id="shamcash" />
              </Label>

              <Label
                htmlFor="cash"
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                  paymentMethod === "cash" 
                    ? "border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 dark:bg-yellow-900/20" 
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${paymentMethod === "cash" ? "bg-yellow-100" : "bg-slate-100 dark:bg-slate-700"}`}>
                  <Banknote className={`h-6 w-6 ${paymentMethod === "cash" ? "text-yellow-600" : "text-slate-600 dark:text-slate-300"}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">{t.settings.cash}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.settings.cashDesc}</p>
                </div>
                <RadioGroupItem value="cash" id="cash" />
              </Label>
            </RadioGroup>
            
            {paymentMethod && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">{t.settings.paymentNote}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="mb-6">
          <h2 className="mb-3 px-1 text-sm font-bold text-slate-500 dark:text-slate-400">{group.title}</h2>
          <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="p-0">
              {group.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 p-4 ${
                    i !== group.items.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
                    <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  
                  {item.isLanguage ? (
                    <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
                      <SelectTrigger className="w-32 border-none bg-slate-100 text-sm font-medium dark:bg-slate-700 dark:text-white">
                        <SelectValue placeholder={t.settings.language} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : item.isDarkMode ? (
                    <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                  ) : item.toggle ? (
                    <Switch defaultChecked={item.defaultOn} />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="mt-8 flex flex-col items-center justify-center">
        <Button 
          className="mx-auto flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-3 text-white shadow-md transition-all hover:shadow-lg hover:from-yellow-600 hover:to-amber-600"
        >
          <Headphones className="h-5 w-5" />
          <span className="font-bold">{t.settings.contactAdmin}</span>
        </Button>
        <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">{t.settings.contactAdminDesc}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" className="rounded-2xl border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40">
          <LogOut className="ml-2 h-4 w-4" />
          {t.settings.logout}
        </Button>
      </div>
    </div>
  );
}
