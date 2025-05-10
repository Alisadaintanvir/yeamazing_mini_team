"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Search, X, MoreVertical, Trash2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import DashboardLoading from "../loading";

export default function TeamManagementPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      const data = await response.json();
      if (data.success) {
        setTeams(data.teams);
      } else {
        toast.error(data.message || "Failed to fetch teams");
      }
    } catch (error) {
      toast.error("Failed to fetch teams");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTeamName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTeams([...teams, data.team]);
        setNewTeamName("");
        setIsCreateDialogOpen(false);
        toast.success("Team created successfully");
      } else {
        toast.error(data.message || "Failed to create team");
      }
    } catch (error) {
      toast.error("Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const response = await fetch(`/api/teams?id=${teamId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setTeams(teams.filter((team) => team.id !== teamId));
        toast.success("Team deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete team");
      }
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  const assignMember = async (teamId, userId) => {
    try {
      const response = await fetch("/api/teams/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTeams(
          teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: [...team.members, data.membership],
                }
              : team
          )
        );
        toast.success("Member added successfully");
      } else {
        toast.error(data.message || "Failed to add member");
      }
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const removeMember = async (teamId, userId) => {
    try {
      const response = await fetch("/api/teams/members", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTeams(
          teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter(
                    (member) => member.user.id !== userId
                  ),
                }
              : team
          )
        );
        toast.success("Member removed successfully");
      } else {
        toast.error(data.message || "Failed to remove member");
      }
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableMembers = (teamId) => {
    const teamMemberIds =
      teams.find((t) => t.id === teamId)?.members.map((m) => m.user.id) || [];
    return users.filter((user) => !teamMemberIds.includes(user.id));
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  disabled={isCreating}
                />
                <Button
                  onClick={createTeam}
                  className="w-full"
                  disabled={isCreating || !newTeamName.trim()}
                >
                  {isCreating ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {team.members.map((member) => (
                      <Avatar
                        key={member.user.id}
                        className="h-8 w-8 border-2 border-background"
                      >
                        <AvatarImage src={member.user.avatar} />
                        <AvatarFallback>
                          {member.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No members
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedTeam(team.id)}
                        className="gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Assign Members
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteTeam(team.id)}
                        className="gap-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Member Assignment Dialog */}
      {selectedTeam && (
        <Dialog
          open={!!selectedTeam}
          onOpenChange={(open) => !open && setSelectedTeam(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Assign Members to{" "}
                {teams.find((t) => t.id === selectedTeam)?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Current Members</h4>
                {teams.find((t) => t.id === selectedTeam)?.members.length ? (
                  <div className="flex flex-wrap gap-2">
                    {teams
                      .find((t) => t.id === selectedTeam)
                      ?.members.map((member) => (
                        <Badge
                          key={member.user.id}
                          variant="outline"
                          className="pr-1"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={member.user.avatar} />
                              <AvatarFallback>
                                {member.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {member.user.name}
                            <button
                              onClick={() =>
                                removeMember(selectedTeam, member.user.id)
                              }
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </Badge>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No members assigned yet
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Available Members</h4>
                {getAvailableMembers(selectedTeam).length ? (
                  <div className="space-y-2">
                    {getAvailableMembers(selectedTeam).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignMember(selectedTeam, user.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All users are already in this team
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
