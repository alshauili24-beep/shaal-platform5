import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const session = await auth();
  console.log("Dashboard Session Check:", session?.user?.email, session?.user?.role);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  } else if (session.user.role === "CLIENT") {
    redirect("/dashboard/client");
  } else if (session.user.role === "FREELANCER") {
    redirect("/dashboard/freelancer");
  }

  // Fallback
  redirect("/login");
}
