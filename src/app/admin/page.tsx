import { getAdminStats, getAdminData } from "@/actions/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
    const stats = await getAdminStats();
    const { users, projects } = await getAdminData();

    return <AdminDashboardClient stats={stats} users={users} projects={projects} />;
}
