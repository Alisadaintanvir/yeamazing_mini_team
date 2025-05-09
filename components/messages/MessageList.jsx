import { FileText, MessageSquare } from "lucide-react";
import Image from "next/image";
import { getFileIcon } from "@/utils/helper";

export default function MessageList({
  messages,
  currentUserId,
  selectedUser,
  messagesEndRef,
}) {
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.recipientId === selectedUser.id) ||
      (msg.recipientId === currentUserId && msg.senderId === selectedUser.id)
  );

  return (
    <div className="py-4 space-y-4">
      {filteredMessages.length > 0 ? (
        filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                msg.senderId === currentUserId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.content && <p>{msg.content}</p>}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {file.type?.startsWith("image/") ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative w-40 h-40 hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-cover rounded"
                            sizes="(max-width: 160px) 100vw, 160px"
                          />
                        </a>
                      ) : (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline flex items-center gap-1"
                          download={file.name}
                        >
                          {getFileIcon(file.type) === "pdf" && (
                            <FileText className="h-4 w-4 text-red-500" />
                          )}
                          {getFileIcon(file.type) === "document" && (
                            <FileText className="h-4 w-4 text-blue-500" />
                          )}
                          {getFileIcon(file.type) === "spreadsheet" && (
                            <FileText className="h-4 w-4 text-green-500" />
                          )}
                          {getFileIcon(file.type) === "file" && (
                            <FileText className="h-4 w-4 text-gray-500" />
                          )}
                          {file.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
        <div className="flex items-center justify-center h-[calc(100vh-400px)]">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-muted-foreground">
                No messages found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Start a conversation with {selectedUser?.name} by sending a
                message
              </p>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
