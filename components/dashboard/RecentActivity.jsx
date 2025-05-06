import {
  FilePlus,
  FileSearch,
  Filter,
  ChevronDown,
  MoreVertical,
  Check,
  Plus,
  MessageSquare,
  Calendar,
  Users,
  Settings,
} from "lucide-react";

function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completed",
      user: "Alex Johnson",
      task: "Homepage redesign",
      time: "2 hours ago",
      icon: <Check className="text-green-500" />,
    },
    {
      id: 2,
      type: "created",
      user: "Sam Wilson",
      task: "New project: Mobile App",
      time: "4 hours ago",
      icon: <Plus className="text-blue-500" />,
    },
    {
      id: 3,
      type: "comment",
      user: "Taylor Swift",
      task: "Dashboard UI",
      time: "1 day ago",
      icon: <MessageSquare className="text-purple-500" />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-1 p-1 bg-gray-100 rounded-full">
              {activity.icon}
            </div>
            <div>
              <p className="text-sm font-medium">
                <span className="text-gray-900">{activity.user}</span>{" "}
                {activity.type}{" "}
                <span className="text-blue-600">{activity.task}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
