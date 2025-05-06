// Quick Actions Component
import { FilePlus, Calendar, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

function QuickActions() {
  const actions = [
    {
      icon: <FilePlus size={18} />,
      label: "New Document",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Calendar size={18} />,
      label: "Schedule Meeting",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Users size={18} />,
      label: "Add Team Member",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <Settings size={18} />,
      label: "Project Settings",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg ${action.color} hover:opacity-90 transition-opacity`}
          >
            <span className="mb-2">{action.icon}</span>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
