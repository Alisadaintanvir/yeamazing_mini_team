import { Send, Paperclip, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getFileIcon } from "@/utils/helper";

export default function MessageInput({
  message,
  setMessage,
  files,
  setFiles,
  isUploading,
  onSend,
  fileInputRef,
  onFileUpload,
  onRemoveFile,
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-muted rounded-md overflow-hidden"
            >
              {file.type.startsWith("image/") ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={file.url || URL.createObjectURL(file.file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 80px) 100vw, 80px"
                    unoptimized={true}
                  />
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 min-w-[150px]">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type) === "pdf" && (
                      <FileText className="h-5 w-5 text-red-500" />
                    )}
                    {getFileIcon(file.type) === "document" && (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    {getFileIcon(file.type) === "spreadsheet" && (
                      <FileText className="h-5 w-5 text-green-500" />
                    )}
                    {getFileIcon(file.type) === "file" && (
                      <FileText className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          className="hidden"
          multiple
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
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
              onSend();
            }
          }}
          disabled={isUploading}
        />
        <Button onClick={onSend} disabled={isUploading}>
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Uploading...</span>
            </div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
