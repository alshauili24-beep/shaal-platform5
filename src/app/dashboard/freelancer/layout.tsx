import type { Metadata } from 'next';
import FreelancerLayoutUI from "./FreelancerLayoutUI";

export const metadata: Metadata = {
    title: 'Freelancer Dashboard | Shaal Platform',
    description: 'Find work and manage your tasks on Shaal Platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <FreelancerLayoutUI>{children}</FreelancerLayoutUI>;
}
