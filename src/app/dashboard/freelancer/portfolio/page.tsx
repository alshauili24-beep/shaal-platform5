"use client";

import { addPortfolioItem, deletePortfolioItem, getPortfolioItems } from "@/actions/portfolio";
import { useLang } from "@/components/LanguageProvider";
import { Plus, Trash2, Image as ImageIcon, ExternalLink, Sparkles, Video, Paperclip, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
    const { lang, t } = useLang();
    const isRTL = lang === "ar";

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const data = await getPortfolioItems();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setAdding(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            await addPortfolioItem(formData);
            // Reload
            await loadItems();
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            alert("Error adding item");
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm(t("حذف هذا العمل؟", "Delete this item?"))) return;
        try {
            await deletePortfolioItem(id);
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            alert("Error deleting");
        }
    }

    return (
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
            <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{t("معرض أعمالي", "My Portfolio")}</h1>
                <p className="text-white/60 mt-2">
                    {t("اعرض أفضل أعمالك لتجذب العملاء", "Showcase your best work to attract clients")}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Side Form (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 glass p-6 rounded-3xl border border-white/10 shadow-xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <div className="w-10 h-10 rounded-full bg-[var(--shaal-orange)]/20 flex items-center justify-center text-[var(--shaal-orange)]">
                                <Plus className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">{t("إضافة عمل جديد", "Add New Work")}</h3>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">{t("عنوان العمل", "Project Title")}</label>
                                <input
                                    name="title"
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--shaal-orange)]/50 focus:bg-black/60 transition-all placeholder:text-white/20"
                                    placeholder={t("مثال: تطبيق توصيل", "e.g. Delivery App")}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">{t("وصف مختصر", "Description")}</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--shaal-orange)]/50 focus:bg-black/60 transition-all placeholder:text-white/20 resize-none"
                                    placeholder={t("ماذا أنجزت؟", "What did you do?")}
                                />
                            </div>

                            {/* Media Inputs */}
                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">{t("الوسائط والمرفقات", "Media & Attachments")}</label>

                                {/* Image Upload */}
                                <div className="relative group">
                                    <input type="file" name="imageFile" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm group-hover:bg-black/60 transition">
                                        <ImageIcon className="w-4 h-4 text-[var(--shaal-orange)]" />
                                        <span className="text-white/60 group-hover:text-white transition">{t("رفع صورة", "Upload Image")}</span>
                                        <Upload className="w-4 h-4 text-white/20 ml-auto" />
                                    </div>
                                </div>

                                {/* Video Upload */}
                                <div className="relative group">
                                    <input type="file" name="videoFile" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm group-hover:bg-black/60 transition">
                                        <Video className="w-4 h-4 text-blue-400" />
                                        <span className="text-white/60 group-hover:text-white transition">{t("رفع فيديو", "Upload Video")}</span>
                                        <Upload className="w-4 h-4 text-white/20 ml-auto" />
                                    </div>
                                </div>

                                {/* File Attachment */}
                                <div className="relative group">
                                    <input type="file" name="attachmentFile" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm group-hover:bg-black/60 transition">
                                        <Paperclip className="w-4 h-4 text-green-400" />
                                        <span className="text-white/60 group-hover:text-white transition">{t("إرفاق ملف", "Attach File")}</span>
                                        <Upload className="w-4 h-4 text-white/20 ml-auto" />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={adding}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-[var(--shaal-orange)] transition-colors duration-300 shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4"
                            >
                                {adding ? (
                                    <span>{t("جاري النشر...", "Publishing...")}</span>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-[var(--shaal-orange)] group-hover:text-black transition-colors" />
                                        <span>{t("نشر العمل", "Publish Item")}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Portfolio List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[4/3] rounded-3xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl text-center px-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <ImageIcon className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">{t("لا توجد أعمال", "No items yet")}</h3>
                            <p className="text-white/40 max-w-xs mx-auto text-sm">{t("ابدأ بإضافة مشاريعك السابقة لملف أعمالك.", "Start by adding your previous projects to your portfolio.")}</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-6">
                            {items.map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-[#0a1f26] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--shaal-orange)]/5 hover:-translate-y-1"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Media Section */}
                                    <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                                        {item.videoUrl ? (
                                            <video
                                                src={item.videoUrl}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        ) : item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                                                <ImageIcon className="w-12 h-12 text-white/10 group-hover:text-white/20 transition" />
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hover:scale-110"
                                                title={t("حذف", "Delete")}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg text-white group-hover:text-[var(--shaal-orange)] transition-colors truncate">{item.title}</h4>
                                        <p className="text-sm text-white/50 mt-2 line-clamp-3 leading-relaxed">{item.description}</p>

                                        {item.attachmentUrl && (
                                            <a
                                                href={item.attachmentUrl}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-white/80 transition w-fit"
                                            >
                                                <Paperclip className="w-3 h-3 text-[var(--shaal-orange)]" />
                                                {t("تحميل المرفق", "Download Attachment")}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
