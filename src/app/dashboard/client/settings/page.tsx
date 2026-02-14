"use client";

import { changePassword, updateProfile } from "@/actions/settings";
import { useLang } from "@/components/LanguageProvider";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
    const { lang, t } = useLang();
    const { data: session, update } = useSession();
    const isRTL = lang === "ar";
    const user = session?.user;

    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoadingInfo(true);
        const formData = new FormData(e.currentTarget);
        try {
            await updateProfile(formData);
            await update(); // Update session on client
            alert(t("تم تحديث البيانات بنجاح", "Profile updated successfully"));
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        } finally {
            setLoadingInfo(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoadingPass(true);
        const formData = new FormData(e.currentTarget);
        try {
            await changePassword(formData);
            (e.target as HTMLFormElement).reset();
            alert(t("تم تغيير كلمة المرور بنجاح", "Password changed successfully"));
        } catch (err: any) {
            const msg = err.message === "Incorrect current password"
                ? t("كلمة المرور الحالية غير صحيحة", "Incorrect current password")
                : t("حدث خطأ ما", "Something went wrong");
            alert(msg);
        } finally {
            setLoadingPass(false);
        }
    }

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <h1 className="text-2xl font-bold">{t("الإعدادات", "Settings")}</h1>

            {/* Profile Info */}
            <div className="glass rounded-3xl border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">{t("البيانات الشخصية", "Personal Information")}</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("الاسم", "Name")}</label>
                        <input name="name" defaultValue={user?.name || ""} required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
                    </div>
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("البريد الإلكتروني", "Email")}</label>
                        <input disabled value={user?.email || ""} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("رقم الهاتف", "Phone Number")}</label>
                        <input name="phone" defaultValue={user?.phone || ""} placeholder="+968..." className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
                    </div>
                    <button disabled={loadingInfo} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition disabled:opacity-50">
                        {loadingInfo ? t("جاري الحفظ...", "Saving...") : t("حفظ التغييرات", "Save Changes")}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className="glass rounded-3xl border border-white/10 p-6">
                <h2 className="text-xl font-bold mb-4">{t("الأمان", "Security")}</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("كلمة المرور الحالية", "Current Password")}</label>
                        <input name="currentPassword" type="password" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
                    </div>
                    <div>
                        <label className="block text-sm text-white/70 mb-1">{t("كلمة المرور الجديدة", "New Password")}</label>
                        <input name="newPassword" type="password" required minLength={6} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30" />
                    </div>
                    <button disabled={loadingPass} className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition disabled:opacity-50">
                        {loadingPass ? t("جاري التغيير...", "Changing...") : t("تغيير كلمة المرور", "Change Password")}
                    </button>
                </form>
            </div>
        </div>
    );
}
