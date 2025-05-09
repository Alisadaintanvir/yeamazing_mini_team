import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatHeader({ user }) {
  return (
    <div className="p-4 border-b flex items-center bg-background">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.role}</p>
      </div>
    </div>
  );
}
