"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import Link from "next/link";
import { useLang } from "./LanguageProvider";

type Notification = {
    id: string;
    title: string;
    content: string;
    link: string | null;
    read: boolean;
    createdAt: Date;
};

export default function NotificationBell() {
    const { t, lang } = useLang();
    const isRTL = lang === "ar";
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [list, setList] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Poll for count
    useEffect(() => {
        const load = () => getUnreadCount().then(setCount);
        load();
        const interval = setInterval(load, 10000); // 10s poll
        return () => clearInterval(interval);
    }, []);

    // Load details on open
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getNotifications().then(data => {
                setList(data);
                setLoading(false);
            });
        }
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleRead = async (id: string, link: string | null) => {
        await markAsRead(id);
        setCount(c => Math.max(0, c - 1));
        setList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setIsOpen(false);
        // Note: Check if link is present. If so, Link component handles navigation, but we need to mark read first?
        // Actually, wrapping the item in Link onClick makes it race condition? 
        // No, we can just fire-and-forget markAsRead and let navigation happen.
    };

    const handleMarkAll = async () => {
        await markAllAsRead();
        setCount(0);
        setList(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/10 transition"
            >
                <Bell className="w-5 h-5 text-white/80" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                        {count > 9 ? "9+" : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`absolute top-full mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 ${isRTL ? "left-0" : "right-0"}`}>
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-sm">{t("الإشعارات", "Notifications")}</h3>
                        {count > 0 && (
                            <button onClick={handleMarkAll} className="text-xs text-[var(--shaal-orange)] hover:underline">
                                {t("تحديد الكل كمقروء", "Mark all as read")}
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-xs text-white/40">Loading...</div>
                        ) : list.length === 0 ? (
                            <div className="p-4 text-center text-xs text-white/40">{t("لا توجد إشعارات", "No notifications")}</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {list.map(notif => (
                                    <Link
                                        href={notif.link || "#"}
                                        key={notif.id}
                                        onClick={() => handleRead(notif.id, notif.link)}
                                        className={`block p-3 hover:bg-white/5 transition ${notif.read ? "opacity-50" : "bg-white/[0.02]"}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? "bg-transparent" : "bg-[var(--shaal-orange)]"}`} />
                                            <div>
                                                <div className="font-bold text-sm text-[var(--shaal-orange)]">{notif.title}</div>
                                                <div className="text-xs text-white/80 leading-relaxed mt-0.5">{notif.content}</div>
                                                <div className="text-[10px] text-white/40 mt-1">
                                                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
