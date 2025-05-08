"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, User, Search, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function MessagePage() {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        const data = await response.json();

        if (data.success) {
          const filteredUsers = data.users.filter(
            (user) => user.id !== session?.user?.id
          );
          setUsers(filteredUsers);
        } else {
          toast.error(data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session]);

  // Load initial conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        if (data.success) {
          setConversations(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!message && files.length === 0) || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append("recipientId", selectedUser.id);
      formData.append("content", message);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setConversations((prev) => [...prev, data.message]);
        setMessage("");
        setFiles([]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-160px)] border rounded-lg">
      {/* User list sidebar */}
      <div className="w-64 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedUser(null)}
              className="hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-80px)]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No users found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.role}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {conversations && conversations.length > 0 ? (
                conversations
                  .filter(
                    (msg) =>
                      (msg.senderId === session?.user?.id &&
                        msg.recipientId === selectedUser.id) ||
                      (msg.recipientId === session?.user?.id &&
                        msg.senderId === selectedUser.id)
                  )
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex mb-4 ${
                        msg.senderId === session?.user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          msg.senderId === session?.user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span className="truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <User className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">
                Select a user to start chatting
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose from the list on the left or click the + button to start
                a new conversation
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const firstUser = filteredUsers[0];
                  if (firstUser) {
                    setSelectedUser(firstUser);
                  }
                }}
              >
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
