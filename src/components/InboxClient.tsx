"use client";

import { useLang } from "@/components/LanguageProvider";
import { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "@/actions/messaging";
import { User, Send, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Conversation = {
    id: string;
    otherUser: any;
    lastMessage: any;
    updatedAt: Date;
};

export default function InboxClient({ initialConversations, userRole }: { initialConversations: Conversation[], userRole: string }) {
    const { t, lang } = useLang();
    const searchParams = useSearchParams();
    const isRTL = lang === "ar";
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("id"));
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === selectedId);

    // Fetch messages on select
    useEffect(() => {
        if (!selectedId) return;
        setLoadingMessages(true);
        getMessages(selectedId).then(msgs => {
            setMessages(msgs);
            setLoadingMessages(false);
        });

        // Polling (Simple V1)
        const interval = setInterval(() => {
            getMessages(selectedId).then(setMessages);
        }, 5000); // 5s poll

        return () => clearInterval(interval);
    }, [selectedId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedId) return;

        const tempId = Date.now().toString();
        const content = inputText;
        setInputText("");

        // Optimistic update
        setMessages(prev => [...prev, {
            id: tempId,
            content,
            senderId: "ME", // Placeholder
            createdAt: new Date(),
            sender: { name: "Me" }, // Placeholder
            isOptimistic: true
        }]);

        await sendMessage(selectedId, content);
        const newMsgs = await getMessages(selectedId);
        setMessages(newMsgs);
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6" dir={isRTL ? "rtl" : "ltr"}>

            {/* Sidebar list */}
            <div className={`w-full md:w-80 flex flex-col glass rounded-2xl border border-white/10 overflow-hidden ${selectedId ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[var(--shaal-orange)]" />
                        {t("الرسائل", "Messages")}
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {conversations.length === 0 && (
                        <div className="text-center p-4 text-white/40 text-sm">
                            {t("لا توجد محادثات", "No conversations")}
                        </div>
                    )}
                    {conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedId(conv.id)}
                            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${selectedId === conv.id ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold border border-white/10">
                                {conv.otherUser?.image ? (
                                    <img src={conv.otherUser.image} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{conv.otherUser?.name?.[0] || "?"}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className="font-semibold text-sm truncate text-white">{conv.otherUser?.name || "Unknown"}</h3>
                                    <span className="text-[10px] text-white/40">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <p className={`text-xs truncate ${conv.lastMessage?.isMine ? "text-white/40" : "text-white/70"}`}>
                                    {conv.lastMessage?.isMine && <span className="text-[var(--shaal-orange)]">{t("أنت: ", "You: ")}</span>}
                                    {conv.lastMessage?.content || t("ابدأ المحادثة", "Start chatting")}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col glass rounded-2xl border border-white/10 overflow-hidden ${!selectedId ? "hidden md:flex" : "flex"}`}>
                {selectedId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                            <button onClick={() => setSelectedId(null)} className="md:hidden text-white/60 hover:text-white">
                                ←
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                {activeConversation?.otherUser?.name?.[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{activeConversation?.otherUser?.name}</h3>
                                <p className="text-[10px] text-white/50">{activeConversation?.otherUser?.role}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {loadingMessages && <div className="text-center text-xs text-white/30">Loading...</div>}
                            {messages.map((msg, i) => {
                                const isMine = msg.senderId === "ME" || (msg.sender && msg.sender.name === "Me") || (msg.senderId !== activeConversation?.otherUser?.id);
                                // Note: senderId check is approximate here without user ID prop, need to fix logic server side or pass user ID. 
                                // Actually getMessages returns senderId. We can compare with `otherUser.id`.
                                const isMe = msg.senderId !== activeConversation?.otherUser?.id;

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm relative ${isMe ? "bg-[var(--shaal-orange)] text-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none border border-white/5"
                                            }`}>
                                            {msg.content}
                                            <div className={`text-[9px] mt-1 opacity-50 ${isMe ? "text-black" : "text-white"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder={t("أكتب رسالتك...", "Type a message...")}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--shaal-orange)] transition"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-2 bg-[var(--shaal-orange)] text-black rounded-xl hover:bg-orange-400 disabled:opacity-50 transition"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 p-10 text-center">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>{t("اختر محادثة للبدء", "Select a conversation to start chatting")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
