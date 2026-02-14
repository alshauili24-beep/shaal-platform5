"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LanguageProvider"; // Make sure to import

export function Sidebar({ children }: { children: React.ReactNode }) {
    const { t } = useLang(); // Hook
    return (
        <aside className="glass rounded-3xl border border-white/10 p-5 h-fit sticky top-24 w-[280px] hidden lg:block">
            <div className="space-y-2">
                {children}

                {/* Admin Link - ideally should check permission, but for now we put it here or the parent passes it */}
                <SideLink href="/admin/requests">
                    {t("طلبات شعل", "Shaal Requests")}
                </SideLink>
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
                <Link href="/" className="text-sm text-white/70 hover:text-white transition block px-4">
                    {t("العودة للرئيسية", "Back to Home")}
                </Link>
                {/* ... signout unused ... */}
            </div>
        </aside>
    );
}

export function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={[
                "block w-full text-left rounded-2xl px-4 py-3 text-sm border transition",
                isActive ? "bg-white/15 border-white/20 font-semibold" : "bg-black/20 border-white/10 hover:bg-white/5",
            ].join(" ")}
        >
            {children}
        </Link>
    );
}
