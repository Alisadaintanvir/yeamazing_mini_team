"use client";

import { useState } from "react";
import TeamStats from "@/components/team/TeamStats";
import MemberTable from "@/components/team/MemberTable";
import TeamSelection from "@/components/team/TeamSelection";
import CreateTeamModal from "@/components/team/CreateTeamModal";

const TeamDashboard = () => {
  // Sample data structure
  const [teams, setTeams] = useState([
    {
      id: "team-1",
      name: "Development Team",
      members: [
        {
          id: "member-1",
          name: "Alex Johnson",
          email: "alex@example.com",
          role: "Admin",
          avatar: "/avatars/01.png",
        },
        {
          id: "member-2",
          name: "Sarah Lee",
          email: "sarah@example.com",
          role: "Manager",
          avatar: "/avatars/02.png",
        },
      ],
    },
    {
      id: "team-2",
      name: "Marketing Team",
      members: [
        {
          id: "member-3",
          name: "Michael Chen",
          email: "michael@example.com",
          role: "Member",
          avatar: "/avatars/03.png",
        },
      ],
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState(teams[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  const currentTeam = teams.find((team) => team.id === selectedTeam);
  const roles = ["Admin", "Manager", "Member"];

  const filteredMembers =
    currentTeam?.members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const updateMemberRole = (memberId, newRole) => {
    setTeams(
      teams.map((team) => {
        if (team.id === selectedTeam) {
          return {
            ...team,
            members: team.members.map((member) =>
              member.id === memberId ? { ...member, role: newRole } : member
            ),
          };
        }
        return team;
      })
    );
  };

  const deleteMember = (memberId) => {
    setTeams(
      teams.map((team) => {
        if (team.id === selectedTeam) {
          return {
            ...team,
            members: team.members.filter((member) => member.id !== memberId),
          };
        }
        return team;
      })
    );
  };

  const handleCreateTeam = (teamName) => {
    const newTeam = {
      id: `team-${teams.length + 1}`,
      name: teamName,
      members: [],
    };
    setTeams([...teams, newTeam]);
    setSelectedTeam(newTeam.id);
  };

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <TeamSelection
        teams={teams}
        searchTerm={searchTerm}
        currentTeam={currentTeam}
        setSelectedTeam={setSelectedTeam}
        selectedTeam={selectedTeam}
        onOpenCreateTeamModal={() => setIsCreateTeamModalOpen(true)}
      />

      {/* Members Table */}
      <MemberTable
        filteredMembers={filteredMembers}
        roles={roles}
        searchTerm={searchTerm}
        updateMemberRole={updateMemberRole}
        deleteMember={deleteMember}
      />

      {/* Team Stats */}
      <TeamStats currentTeam={currentTeam} roles={roles} />

      {/* Create Team Modal */}
      <CreateTeamModal
        open={isCreateTeamModalOpen}
        onOpenChange={setIsCreateTeamModalOpen}
        onCreateTeam={handleCreateTeam}
      />
    </div>
  );
};

export default TeamDashboard;
