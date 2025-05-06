import { Button } from "@/components/ui/button";
function TeamStats({ currentTeam, roles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-medium">Team Summary</h3>
        <div className="mt-2">
          <p>{currentTeam?.members.length || 0} members</p>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString()} update
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-medium">Roles Distribution</h3>
        <div className="mt-2 space-y-1">
          {roles.map((role) => (
            <div key={role} className="flex justify-between">
              <span>{role}</span>
              <span>
                {currentTeam?.members.filter((m) => m.role === role).length ||
                  0}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-medium">Quick Actions</h3>
        <div className="mt-2 space-y-2">
          <Button variant="outline" className="w-full">
            Invite via Email
          </Button>
          <Button variant="outline" className="w-full">
            Export Team Data
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TeamStats;
