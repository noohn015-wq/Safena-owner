import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { databases, APPWRITE_DATABASE_ID, COMPLAINTS_TABLE_ID } from "@/lib/appwrite";
import { ID } from "appwrite";

export function ComplaintsPage({ t, user }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        COMPLAINTS_TABLE_ID,
        ID.unique(),
        {
          customer_name: user?.name || "عميل",
          customer_phone: user?.phone || "00000000",
          subject: subject,
          details: details,
          status: "جديد"
        }
      );

      // تم حذف الـ alert نهائياً لكي لا تظهر نافذة المتصفح المزعجة
      setSubmitted(true);
      setSubject("");
      setDetails("");
      setTimeout(() => setSubmitted(false), 4000);

    } catch (error: any) {
      console.error("Appwrite complaint insert error:", error);
      alert("خطأ من السيرفر: " + (error.message || JSON.stringify(error)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.complaints}</h1>
      {submitted ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-green-800 dark:text-green-400">{t.complaintSubmitted}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.complaintSubject}</label>
                <Input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required 
                  className="rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.complaintDetails}</label>
                <Textarea 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)} 
                  required 
                  rows={4} 
                  className="rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white" 
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 py-6 text-base font-bold text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600 disabled:opacity-50"
              >
                {submitting ? t.submitting : t.submitComplaint}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
