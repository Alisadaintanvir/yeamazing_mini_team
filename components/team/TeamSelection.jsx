import { Plus, Search, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function TeamSelection({
  currentTeam,
  teams,
  searchTerm,
  setSelectedTeam,
  selectedTeam,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center gap-4">
        <Users className="h-6 w-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {currentTeam?.name || "Select Team"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={selectedTeam === team.id ? "bg-gray-100" : ""}
              >
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Create New Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-9 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
    </div>
  );
}

export default TeamSelection;
