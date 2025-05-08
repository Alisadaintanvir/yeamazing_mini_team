"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  Clock,
  Check,
  Circle,
  Flag,
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
  const [projects, setProjects] = useState([
    {
      id: "proj-1",
      name: "Website Redesign",
      status: "in-progress",
      priority: "high",
      progress: 65,
      dueDate: "2023-06-15",
      team: ["Alex", "Sarah"],
    },
    {
      id: "proj-2",
      name: "Mobile App Launch",
      status: "todo",
      priority: "medium",
      progress: 0,
      dueDate: "2023-07-01",
      team: ["Michael", "Emily"],
    },
    {
      id: "proj-3",
      name: "API Integration",
      status: "done",
      priority: "low",
      progress: 100,
      dueDate: "2023-05-10",
      team: ["David"],
    },
  ]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = (projectId, newStatus) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    );
  };

  const updatePriority = (projectId, newPriority) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, priority: newPriority }
          : project
      )
    );
  };

  const getStatus = (statusValue) =>
    statuses.find((s) => s.value === statusValue) || statuses[0];

  const getPriority = (priorityValue) =>
    priorities.find((p) => p.value === priorityValue) || priorities[0];

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const status = getStatus(project.status);
                const priority = getPriority(project.priority);
                const StatusIcon = status.icon;

                return (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 px-2"
                          >
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 px-2"
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${priority.color}`}
                            />
                            {priority.label}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {priorities.map((p) => (
                            <DropdownMenuItem
                              key={p.value}
                              onClick={() =>
                                updatePriority(project.id, p.value)
                              }
                              className="gap-2"
                            >
                              <span
                                className={`h-3 w-3 rounded-full ${p.color}`}
                              />
                              {p.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
                        {project.team.map((member, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs -ml-1 border border-white"
                          >
                            {member.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
