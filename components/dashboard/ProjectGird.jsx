import { motion } from "framer-motion";
import { FilePlus, MoreVertical, Check, Plus } from "lucide-react";

function ProjectGrid({ expandedProject, setExpandedProject }) {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      members: [
        { name: "Alex", avatar: "A", color: "bg-blue-500" },
        { name: "Sam", avatar: "S", color: "bg-green-500" },
        { name: "Taylor", avatar: "T", color: "bg-purple-500" },
      ],
      dueDate: "2023-12-15",
      tasks: [
        { id: 1, name: "Homepage design", completed: true },
        { id: 2, name: "Mobile responsive", completed: true },
        { id: 3, name: "Content migration", completed: false },
      ],
    },
    {
      id: 2,
      name: "Mobile App Launch",
      progress: 30,
      members: [
        { name: "Jordan", avatar: "J", color: "bg-yellow-500" },
        { name: "Casey", avatar: "C", color: "bg-red-500" },
      ],
      dueDate: "2024-01-20",
      tasks: [
        { id: 1, name: "Wireframing", completed: true },
        { id: 2, name: "UI Design", completed: false },
      ],
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 90,
      members: [{ name: "Morgan", avatar: "M", color: "bg-pink-500" }],
      dueDate: "2023-11-30",
      tasks: [
        { id: 1, name: "Social media plan", completed: true },
        { id: 2, name: "Content creation", completed: true },
        { id: 3, name: "Launch campaign", completed: false },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          whileHover={{ y: -5 }}
          className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
            expandedProject === project.id ? "shadow-md" : "hover:shadow-md"
          }`}
        >
          <div
            className="p-4 cursor-pointer"
            onClick={() =>
              setExpandedProject(
                expandedProject === project.id ? null : project.id
              )
            }
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{project.name}</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex -space-x-2">
                {project.members.map((member, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-medium`}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
              <span className="text-gray-500">Due {project.dueDate}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
          </div>

          {expandedProject === project.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium mb-2">Tasks</h4>
                <ul className="space-y-2">
                  {project.tasks.map((task) => (
                    <li key={task.id} className="flex items-center">
                      <span
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center mr-2 ${
                          task.completed
                            ? "bg-green-100 border-green-500 text-green-500"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {task.completed && <Check size={12} />}
                      </span>
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="flex items-center text-sm text-blue-600 mt-2">
                  <Plus size={14} className="mr-1" /> Add Task
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer"
      >
        <FilePlus className="text-gray-400 mb-2" size={20} />
        <span className="text-gray-500">New Project</span>
      </motion.div>
    </div>
  );
}

export default ProjectGrid;
