"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  Loader2,
  Check,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import DashboardLoading from "../loading";

const roles = ["ADMIN", "MANAGER", "MEMBER"]; // Updated to match your schema

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({
    roles: {},
  });
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin) {
      toast.error("Only administrators can change user roles");
      return;
    }

    if (userId === session?.user?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      roles: { ...prev.roles, [userId]: true },
    }));

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success(`User's role has been changed to ${newRole}`);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Failed to update role");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        roles: { ...prev.roles, [userId]: false },
      }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!isAdmin) {
      toast.error("Only administrators can delete users");
      return;
    }

    if (userId === session?.user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

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
          {isAdmin && (
            <Button>
              <User className="h-4 w-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No users found
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm
                        ? "No users match your search criteria"
                        : "There are no users in the system yet"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
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
                    {isAdmin ? (
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
                              disabled={
                                user.role === role ||
                                user.id === session?.user?.id
                              }
                            >
                              {role}
                              {user.role === role && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Badge variant="outline">{user.role}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && (
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
                          {user.id !== session?.user?.id && (
                            <DropdownMenuItem
                              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
