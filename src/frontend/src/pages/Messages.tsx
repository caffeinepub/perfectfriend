import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MOCK_CONVERSATIONS, type MockMessage } from "../data/mockData";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "now";
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function Messages() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(MOCK_CONVERSATIONS[0].id);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId)!;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const newMsg: MockMessage = {
      id: `msg_${Date.now()}`,
      text: messageInput,
      senderId: "me",
      createdAt: new Date().toISOString(),
      read: true,
    };
    setConversations((convs) =>
      convs.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: messageInput,
              lastMessageTime: newMsg.createdAt,
              unread: 0,
            }
          : c,
      ),
    );
    setMessageInput("");
  };

  const selectConv = (id: string) => {
    setActiveConvId(id);
    setConversations((convs) =>
      convs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div
        className="bg-card rounded-2xl border border-border overflow-hidden"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="flex h-full">
          {/* Conversations list */}
          <div className="w-72 border-r border-border flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold font-display text-lg mb-3">Messages</h2>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 h-8 text-xs bg-secondary border-0"
                  data-ocid="messages.search.input"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((conv, i) => (
                <button
                  type="button"
                  key={conv.id}
                  onClick={() => selectConv(conv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors ${
                    conv.id === activeConvId ? "bg-secondary" : ""
                  }`}
                  data-ocid={`messages.conversation.item.${i + 1}`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conv.user.avatar} />
                      <AvatarFallback>
                        {conv.user.displayName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conv.user.isOnline && (
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card"
                        style={{ background: "oklch(var(--online-green))" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">
                        {conv.user.displayName}
                      </p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge
                      className="text-[10px] h-4 px-1.5 flex-shrink-0"
                      style={{ background: "oklch(var(--primary))" }}
                      data-ocid={`messages.unread.badge.${i + 1}`}
                    >
                      {conv.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat view */}
          {activeConv && (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={activeConv.user.avatar} />
                  <AvatarFallback>
                    {activeConv.user.displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {activeConv.user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeConv.user.isOnline ? (
                      <span style={{ color: "oklch(var(--online-green))" }}>
                        ● Online
                      </span>
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.map((msg, i) => {
                  const isMe = msg.senderId === "me";
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      data-ocid={`messages.message.item.${i + 1}`}
                    >
                      {!isMe && (
                        <Avatar className="w-7 h-7 mr-2 flex-shrink-0 self-end">
                          <AvatarImage src={activeConv.user.avatar} />
                          <AvatarFallback>
                            {activeConv.user.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className="max-w-[70%] px-3 py-2 rounded-2xl text-sm"
                        style={{
                          background: isMe
                            ? "oklch(var(--primary))"
                            : "oklch(var(--secondary))",
                          color: isMe ? "white" : "oklch(var(--foreground))",
                          borderBottomRightRadius: isMe ? "4px" : undefined,
                          borderBottomLeftRadius: !isMe ? "4px" : undefined,
                        }}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-4 py-3 border-t border-border"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary border-0 rounded-full"
                  data-ocid="messages.send.input"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full w-10 h-10 flex-shrink-0"
                  style={{ background: "oklch(var(--primary))" }}
                  data-ocid="messages.send.button"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
