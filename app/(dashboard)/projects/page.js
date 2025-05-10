"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  Clock,
  Check,
  Circle,
  Flag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import DashboardLoading from "../loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statuses = [
  { value: "backlog", label: "Backlog", icon: Circle, color: "bg-gray-400" },
  { value: "todo", label: "Todo", icon: Circle, color: "bg-blue-400" },
  {
    value: "in-progress",
    label: "In Progress",
    icon: Clock,
    color: "bg-yellow-400",
  },
  { value: "done", label: "Done", icon: Check, color: "bg-green-400" },
  { value: "cancelled", label: "Cancelled", icon: Flag, color: "bg-red-400" },
];

const priorities = [
  { value: "low", label: "Low", color: "bg-green-400" },
  { value: "medium", label: "Medium", color: "bg-yellow-400" },
  { value: "high", label: "High", color: "bg-red-400" },
];

export default function ProjectPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/project");
        const data = await response.json();
        console.log("data", data);
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        const data = await response.json();
        if (data.success) {
          setTeams(data.teams);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      }
    };

    fetchTeams();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (projectId, newStatus) => {
    try {
      const response = await fetch("/api/project", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update project status");
      }

      // Update local state
      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, status: newStatus } : project
        )
      );

      toast.success("Project status updated successfully");
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error(error.message || "Failed to update project status");
    }
  };

  const updatePriority = async (projectId, newPriority) => {
    try {
      const response = await fetch("/api/project", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          priority: newPriority,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update project priority");
      }

      // Update local state
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, priority: newPriority }
            : project
        )
      );

      toast.success("Project priority updated successfully");
    } catch (error) {
      console.error("Error updating project priority:", error);
      toast.error(error.message || "Failed to update project priority");
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`/api/project?id=${projectId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete project");
      }

      // Update local state
      setProjects(projects.filter((project) => project.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete project");
    }
  };

  const assignTeam = async (projectId, teamId) => {
    try {
      const response = await fetch("/api/project", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: projectId,
          teamId: teamId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProjects(
          projects.map((project) =>
            project.id === projectId ? data.project : project
          )
        );
        toast.success("Team assigned successfully");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error assigning team:", error);
      toast.error(error.message || "Failed to assign team");
    }
  };

  const getStatus = (statusValue) =>
    statuses.find((s) => s.value === statusValue) || statuses[0];

  const getPriority = (priorityValue) =>
    priorities.find((p) => p.value === priorityValue) || priorities[0];

  const handleProjectCreated = (newProject) => {
    if (!newProject) {
      console.error("Received undefined project in handleProjectCreated");
      return;
    }

    // Ensure all required properties are present
    const projectWithDefaults = {
      ...newProject,
      name: newProject.name || "",
      description: newProject.description || "",
      status: newProject.status || "todo",
      priority: newProject.priority || "medium",
      progress: newProject.progress || 0,
      team: newProject.team || [],
      dueDate: newProject.dueDate || null,
    };

    console.log("Adding new project:", projectWithDefaults);
    setProjects((prevProjects) => [...prevProjects, projectWithDefaults]);
  };

  const canModifyProject = (userRole) => {
    return userRole === "ADMIN";
  };

  const renderStatusCell = (project) => {
    const status = getStatus(project.status);
    const StatusIcon = status.icon;

    if (!canModifyProject(session?.user?.role)) {
      return (
        <TableCell>
          <div className="flex items-center gap-2 px-2">
            <StatusIcon className={`h-3 w-3 ${status.color}`} />
            {status.label}
          </div>
        </TableCell>
      );
    }

    return (
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <StatusIcon className={`h-3 w-3 ${status.color}`} />
              {status.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => updateStatus(project.id, s.value)}
                className="gap-2"
              >
                <s.icon className={`h-3 w-3 ${s.color}`} />
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    );
  };

  const renderPriorityCell = (project) => {
    const priority = getPriority(project.priority);

    if (!canModifyProject(session?.user?.role)) {
      return (
        <TableCell>
          <div className="flex items-center gap-2 px-2">
            <span className={`h-3 w-3 rounded-full ${priority.color}`} />
            {priority.label}
          </div>
        </TableCell>
      );
    }

    return (
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <span className={`h-3 w-3 rounded-full ${priority.color}`} />
              {priority.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorities.map((p) => (
              <DropdownMenuItem
                key={p.value}
                onClick={() => updatePriority(project.id, p.value)}
                className="gap-2"
              >
                <span className={`h-3 w-3 rounded-full ${p.color}`} />
                {p.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    );
  };

  const renderTeamCell = (project) => {
    const isAdmin = canModifyProject(session?.user?.role);

    if (!isAdmin) {
      return (
        <TableCell className="text-right">
          <div className="flex justify-end">
            {project.team && project.team.name ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                  {project.team.name.charAt(0)}
                </div>
                <span className="text-sm">{project.team.name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No team</span>
            )}
          </div>
        </TableCell>
      );
    }

    return (
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {project.team && project.team.name ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {project.team.name.charAt(0)}
                  </div>
                  {project.team.name}
                </>
              ) : (
                "Assign Team"
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => assignTeam(project.id, null)}
              className={!project.team ? "text-muted-foreground" : ""}
            >
              No Team
            </DropdownMenuItem>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => assignTeam(project.id, team.id)}
                className={project.team?.id === team.id ? "bg-accent" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {team.name.charAt(0)}
                  </div>
                  {team.name}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    );
  };

  const renderDeleteButton = (project) => {
    const isAdmin = session?.user?.role === "ADMIN";

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              isAdmin
                ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAdmin}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isAdmin ? (
                <>
                  This action cannot be undone. This will permanently delete the
                  project &apos;{project.name}&apos; and all its associated
                  data.
                </>
              ) : (
                "You don't have permission to delete projects. Please contact an administrator."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProject(project.id)}
              className={`${
                isAdmin
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isAdmin}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {session?.user?.role === "ADMIN" && (
            <CreateProjectDialog onProjectCreated={handleProjectCreated} />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm
                  ? "No projects match your search criteria"
                  : session?.user?.role === "ADMIN"
                  ? "Get started by creating your first project"
                  : "There are no projects available at the moment"}
              </p>
              {session?.user?.role === "ADMIN" && !searchTerm && (
                <CreateProjectDialog onProjectCreated={handleProjectCreated}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CreateProjectDialog>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Team</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {project.name}
                      </div>
                    </TableCell>
                    {renderStatusCell(project)}
                    {renderPriorityCell(project)}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(project.dueDate).toLocaleDateString()}
                    </TableCell>
                    {renderTeamCell(project)}
                    <TableCell className="text-right">
                      {renderDeleteButton(project)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
