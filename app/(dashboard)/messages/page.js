"use client";

import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import UserList from "@/components/messages/UserList";
import ChatHeader from "@/components/messages/ChatHeader";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";
import { User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";

export default function MessagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Helper function for file icons
  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("video/")) return "video";
    if (fileType.startsWith("audio/")) return "audio";
    if (fileType.includes("pdf")) return "pdf";
    if (fileType.includes("word")) return "document";
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return "spreadsheet";
    return "file";
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session?.user?.id]);

  // Load initial conversations
  useEffect(() => {
    const fetchConversations = async (userId) => {
      try {
        const response = await fetch(`/api/messages?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          setConversations(data.messages || []);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to fetch messages");
      }
    };

    fetchConversations(selectedUser?.id);
  }, [selectedUser?.id]);

  // Update the useEffect for handling URL parameters
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUser(user);
        fetchConversations(user.id);
      }
    }
  }, [searchParams, users]);

  // Add Pusher subscription effect
  useEffect(() => {
    if (!selectedUser?.id || !session?.user?.id) return;

    const channelName = `private-chat-${[session.user.id, selectedUser.id]
      .sort()
      .join("-")}`;

    try {
      const channel = pusherClient.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", () => {});

      channel.bind("pusher:subscription_error", (error) => {
        console.error("Error subscribing to channel:", error);
      });

      channel.bind("new-message", (data) => {
        if (data.senderId !== session.user.id) {
          setConversations((prev) => [...prev, data]);
          setTimeout(scrollToBottom, 100);
        }
      });

      return () => {
        pusherClient.unsubscribe(channelName);
      };
    } catch (error) {
      console.error("Error setting up Pusher subscription:", error);
    }
  }, [selectedUser?.id, session?.user?.id]);

  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);

    // First, create preview URLs for all files
    const previewFiles = newFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      file: file, // Keep the actual file object for later upload
    }));

    // Add previews to the files state immediately
    setFiles((prev) => [...prev, ...previewFiles]);

    // Then upload each file
    try {
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          // Update the file URL after successful upload
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, url: data.url } : f
            )
          );
          toast.success("File uploaded successfully");
        } else {
          // Remove the file if upload fails
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
          toast.error(data.message || "Failed to upload file");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Remove all files that failed to upload
      setFiles((prev) =>
        prev.filter((f) => !newFiles.some((nf) => nf.name === f.name))
      );
      toast.error("Failed to upload file");
    }
  };

  // Add cleanup for object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      files.forEach((file) => {
        if (file.url && file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Update sendMessage function to include more debugging
  const sendMessage = async () => {
    if ((!message && files.length === 0) || !selectedUser) return;

    try {
      if (files.length > 0) {
        setIsUploading(true);
      }

      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.url && !file.url.startsWith("blob:")) {
            return file;
          }

          const formData = new FormData();
          formData.append("file", file.file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            return {
              name: file.name,
              type: file.type,
              size: file.size,
              url: data.url,
            };
          } else {
            throw new Error(data.message || "Failed to upload file");
          }
        })
      );

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: message,
          attachments: uploadedFiles,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConversations((prev) => [...prev, data.message]);
        setMessage("");
        setFiles([]);
        toast.success("Message sent successfully");
        setTimeout(scrollToBottom, 100);
      } else {
        console.error("Failed to send message:");
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      if (files.length > 0) {
        setIsUploading(false);
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update the handleUserSelect function
  const handleUserSelect = (user) => {
    isInitialLoad.current = true; // Reset initial load flag when selecting new user
    setSelectedUser(user);
    fetchConversations(user.id);
    router.push(`/messages?userId=${user.id}`);
  };

  // Update the fetchConversations function
  const fetchConversations = async (userId) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setConversations(data.messages);
        // Use immediate scroll for initial load
        if (isInitialLoad.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          isInitialLoad.current = false;
        } else {
          // Use smooth scroll for new messages
          setTimeout(scrollToBottom, 100);
        }
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to fetch messages");
    }
  };

  // Update the scrollToBottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isInitialLoad.current ? "auto" : "smooth",
    });
  };

  // Update the useEffect for scrolling
  useEffect(() => {
    if (conversations.length > 0) {
      scrollToBottom();
    }
  }, [conversations]);

  return (
    <div className="flex h-[calc(100vh-160px)] border rounded-lg">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      ) : (
        <>
          <UserList
            users={users}
            loading={false}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            onClearSelection={() => setSelectedUser(null)}
          />

          <div className="flex-1 flex flex-col relative h-full">
            {selectedUser ? (
              <>
                <ChatHeader user={selectedUser} />
                <div
                  className="flex-1 overflow-y-auto px-4"
                  style={{
                    height: "calc(100% - 140px)",
                    paddingBottom: "100px",
                  }}
                >
                  <MessageList
                    messages={conversations}
                    currentUserId={session?.user?.id}
                    selectedUser={selectedUser}
                    messagesEndRef={messagesEndRef}
                  />
                </div>
                <MessageInput
                  message={message}
                  setMessage={setMessage}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  onSend={sendMessage}
                  fileInputRef={fileInputRef}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={removeFile}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <User className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    Select a user to start chatting
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from the list on the left or click the + button to
                    start a new conversation
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
        </>
      )}
    </div>
  );
}
