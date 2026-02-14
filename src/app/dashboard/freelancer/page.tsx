import { auth } from "@/auth";
import Link from "next/link";

export default async function FreelancerDashboard() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="space-y-6">
            <div className="glass rounded-3xl border border-white/10 p-6 flex items-start justify-between gap-6 flex-wrap">
                <div>
                    <div className="text-sm text-white/60">Dashboard</div>
                    <h1 className="text-3xl font-black mt-1">Welcome, {user?.name || "Freelancer"}</h1>
                    <p className="mt-2 text-white/70">Find work and manage your tasks.</p>
                </div>
                <div>
                    <Link
                        href="/dashboard/freelancer/jobs"
                        className="inline-block rounded-2xl px-5 py-3 font-semibold text-black"
                        style={{ background: "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))" }}
                    >
                        Find Work
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Stats Cards */}
                <div className="glass rounded-3xl border border-white/10 p-6">
                    <div className="text-sm text-white/60">Rating</div>
                    <div className="text-3xl font-bold mt-2">⭐ {user?.image || "0.0"}</div>
                    {/* Using image field as temp holder or need to fetch from DB */}
                </div>
            </div>
        </div>
    );
}
