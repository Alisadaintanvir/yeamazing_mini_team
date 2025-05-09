import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LoadingSpinner from "./LoadingSpinner";

export default function UserList({
  users,
  loading,
  searchTerm,
  setSearchTerm,
  selectedUser,
  onUserSelect,
  onClearSelection,
}) {
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
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
          <LoadingSpinner message="Loading users..." />
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
              onClick={() => onUserSelect(user)}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
