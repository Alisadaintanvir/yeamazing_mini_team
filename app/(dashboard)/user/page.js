"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  ChevronDown,
  User,
  Mail,
  Shield,
  Loader2,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const roles = ["Admin", "Editor", "Viewer", "Guest"];
const statuses = ["active", "pending", "suspended"];
export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    roles: {}, // { "user-1": true, "user-2": false }
    statuses: {}, // { "user-1": true, "user-2": false }
  });
  const [users, setUsers] = useState([
    {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Admin",
      status: "active",
      avatar: "/avatars/01.png",
      lastActive: "2023-05-15T10:30:00Z",
    },
    {
      id: "user-2",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Editor",
      status: "active",
      avatar: "/avatars/02.png",
      lastActive: "2023-05-14T15:45:00Z",
    },
    {
      id: "user-3",
      name: "Michael Chen",
      email: "michael@example.com",
      role: "Viewer",
      status: "pending",
      avatar: "/avatars/03.png",
      lastActive: "2023-05-10T09:15:00Z",
    },
    {
      id: "user-4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Guest",
      status: "suspended",
      avatar: "/avatars/04.png",
      lastActive: "2023-04-28T14:20:00Z",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId, newRole) => {
    setLoadingStates((prev) => ({
      ...prev,
      roles: { ...prev.roles, [userId]: true },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role updated",
        description: `User's role has been changed to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        roles: { ...prev.roles, [userId]: false },
      }));
    }
  };

  // Similar modification for handleStatusChange
  const handleStatusChange = async (userId, newStatus) => {
    setLoadingStates((prev) => ({
      ...prev,
      statuses: { ...prev.statuses, [userId]: true },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast({
        title: "Status updated",
        description: `User's status has been changed to ${newStatus}`,
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        statuses: { ...prev.statuses, [userId]: false },
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <User className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        user.status
                      )} mr-2`}
                    />
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-28 justify-between"
                        disabled={loadingStates.roles[user.id]}
                      >
                        {loadingStates.roles[user.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {user.role}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {roles.map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleRoleChange(user.id, role)}
                          disabled={user.role === role}
                        >
                          {role}
                          {user.role === role && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Mail className="h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <DropdownMenuItem className="gap-2">
                            <Shield className="h-4 w-4" />
                            Change Status
                          </DropdownMenuItem>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statuses.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(user.id, status)
                              }
                              disabled={user.status === status}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${getStatusColor(
                                  status
                                )} mr-2`}
                              />
                              {status}
                              {user.status === status && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
