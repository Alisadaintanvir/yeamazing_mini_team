"use client";
import { FilePlus, FileSearch, Filter } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import ProjectGrid from "@/components/dashboard/ProjectGird";
import TaskKanban from "@/components/dashboard/TaskKanban";
import TeamProgress from "@/components/dashboard/TeamProgress";
import QuickActions from "@/components/dashboard/QuickAction";
import RecentActivity from "@/components/dashboard/RecentActivity";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
  const [activeView, setActiveView] = useState("overview");
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            Team Dashboard
          </motion.h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s an overview of all the projects
            what&apos;s happening with your team.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FileSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition-all"
          >
            <FilePlus size={18} /> New Project
          </motion.button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex border-b border-gray-200 mb-6">
        {["overview", "projects", "tasks", "analytics"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeView === view
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Projects</h2>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <Filter size={16} /> Filter
                </button>
              </div>
              <ProjectGrid
                expandedProject={expandedProject}
                setExpandedProject={setExpandedProject}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-semibold mb-4">Task Board</h2>
              <TaskKanban />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TeamProgress />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RecentActivity />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <QuickActions />
            </motion.div>
          </div>
        </div>
      )}

      {activeView === "projects" && <ProjectListView />}
      {activeView === "tasks" && <TaskListView />}
      {activeView === "analytics" && <AnalyticsView />}
    </div>
  );
}

// Placeholder Views
function ProjectListView() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">All Projects</h2>
      <p>Project list view content goes here</p>
    </div>
  );
}

function TaskListView() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">All Tasks</h2>
      <p>Task list view content goes here</p>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      <p>Analytics view content goes here</p>
    </div>
  );
}

export default DashboardPage;
