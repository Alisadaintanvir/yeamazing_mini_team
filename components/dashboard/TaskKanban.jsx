"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MoreVertical } from "lucide-react";

// Interactive Task Kanban Board
function TaskKanban() {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "1", content: "Design new homepage layout", priority: "high" },
      { id: "2", content: "Create project timeline", priority: "medium" },
    ],
    inProgress: [
      { id: "3", content: "Develop authentication system", priority: "high" },
    ],
    done: [{ id: "4", content: "Setup database schema", priority: "low" }],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const [removed] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, removed);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
      });
    } else {
      destColumn.splice(destination.index, 0, removed);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(tasks).map(([columnId, columnTasks]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium capitalize">
                    {columnId.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-500">
                    {columnTasks.length} tasks
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded-lg shadow-xs border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{task.content}</p>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              2d ago
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskKanban;
