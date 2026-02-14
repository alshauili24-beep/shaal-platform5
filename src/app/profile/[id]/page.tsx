import { getPublicPortfolio, getPublicUserProfile } from "@/actions/profile";
import ProfileClient from "./ProfileClient";
import Navbar from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getPublicUserProfile(id);
    return {
        title: user ? `${user.name} | Portfolio` : 'User Not Found'
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getPublicUserProfile(id);
    const portfolio = await getPublicPortfolio(id);

    return (
        <>
            <Navbar /> {/* Ensure Navbar is present even on public pages */}
            <ProfileClient user={user} portfolio={portfolio} />
        </>
    );
}
