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

  const getStatus = (statusValue) =>
    statuses.find((s) => s.value === statusValue) || statuses[0];

  const getPriority = (priorityValue) =>
    priorities.find((p) => p.value === priorityValue) || priorities[0];

  const handleProjectCreated = (newProject) => {
    const projectWithDefaults = {
      ...newProject,
      progress: newProject.progress || 0,
      team: newProject.team || [],
    };
    setProjects([...projects, projectWithDefaults]);
  };

  const canModifyProject = (userRole) => {
    return userRole === "ADMIN" || userRole === "MANAGER";
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
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      {project.team ? (
                        project.team.map((member, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs -ml-1 border border-white"
                          >
                            {member.charAt(0)}
                          </div>
                        ))
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs -ml-1 border border-white">
                          -
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {renderDeleteButton(project)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
