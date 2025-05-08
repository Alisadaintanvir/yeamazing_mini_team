"use client";

import { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  Smile,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Sample users data
  const users = [
    {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/avatars/01.png",
      status: "online",
    },
    {
      id: "user-2",
      name: "Sarah Lee",
      avatar: "/avatars/02.png",
      status: "offline",
    },
    {
      id: "user-3",
      name: "Michael Chen",
      avatar: "/avatars/03.png",
      status: "online",
    },
  ];

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const sendMessage = () => {
    if ((!message && files.length === 0) || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      sender: "current-user", // In a real app, this would be your user ID
      recipient: selectedUser.id,
      text: message,
      files: files,
      timestamp: new Date(),
    };

    setConversations([...conversations, newMessage]);
    setMessage("");
    setFiles([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] border rounded-lg">
      {/* User list sidebar */}
      <div className="w-64 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-80px)]">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {conversations
                .filter(
                  (msg) =>
                    (msg.sender === "current-user" &&
                      msg.recipient === selectedUser.id) ||
                    (msg.recipient === "current-user" &&
                      msg.sender === selectedUser.id)
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${
                      msg.sender === "current-user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                        msg.sender === "current-user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.files?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.files.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center p-2 bg-background/50 rounded"
                            >
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span className="text-sm truncate">
                                {file.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      <span className="max-w-[120px] truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        &times;
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
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <User className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">
                Select a user to start chatting
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose from the list on the left
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
