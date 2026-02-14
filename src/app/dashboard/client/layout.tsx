import type { Metadata } from 'next';
import ClientLayoutUI from "./ClientLayoutUI";

export const metadata: Metadata = {
    title: 'Client Dashboard | Shaal Platform',
    description: 'Manage your projects and proposals on Shaal Platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ClientLayoutUI>{children}</ClientLayoutUI>;
}
