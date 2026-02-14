import { getConversations } from "@/actions/messaging";
import InboxClient from "@/components/InboxClient";

export default async function MessagesPage() {
    const conversations = await getConversations();

    return (
        <div className="h-full">
            <h1 className="text-2xl font-bold mb-6 sr-only">Messages</h1>
            <InboxClient initialConversations={conversations} userRole="FREELANCER" />
        </div>
    );
}
