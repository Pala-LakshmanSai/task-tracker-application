"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TaskInterface } from "@/models/Tasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical } from "lucide-react";
import AddTask from "@/components/AddTask";
import ViewTaskDialog from "@/components/ViewTaskDialog";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [viewTask, setViewTask] = useState<TaskInterface | null>(null);
  const [editTask, setEditTask] = useState<TaskInterface | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch(`/api/tasks?archived=${showArchived}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [showArchived]);

  const filteredTasks = tasks.filter((task) => {
    return (
      (!statusFilter ||
        statusFilter === "all" ||
        task.status === statusFilter) &&
      (!priorityFilter ||
        priorityFilter === "all" ||
        task.priority === priorityFilter)
    );
  });

  const handleCompleteToggle = async (task: TaskInterface) => {
    const isNowCompleted = !task.completed;
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: isNowCompleted,
        status: isNowCompleted ? "Done" : "To Do",
      }),
    });
    if (res.ok) fetchTasks();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) fetchTasks();
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-8 space-y-8 relative overflow-hidden rounded-xl shadow-cyan-400 shadow-2xl">
      <div className=" absolute h-full inset-0 z-0 pointer-events-none bg-[conic-gradient(at_top_left,red,red,blue,cyan)] dark:bg-[conic-gradient(at_bottom_right,black,gray,gray,black)] opacity-55 " />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Task List
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <AddTask onSuccess={fetchTasks} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-10 my-10">
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pb-4">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => {
              setShowArchived(e.target.checked);
            }}
            className="accent-blue-500 w-4 h-4"
            id="archived-toggle"
          />
          <label
            htmlFor="archived-toggle"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Show Archived Tasks
          </label>
        </div>

        <div className="hidden md:grid grid-cols-6 text-xs font-semibold uppercase px-4 pt-6 pb-2 text-dark dark:text-white">
          <div>Title</div>
          <div>Due Date</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Completed</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="grid grid-cols-1 divide-y rounded-xl border bg-white dark:bg-gray-900 shadow-md overflow-hidden mt-2">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="flex flex-col md:grid md:grid-cols-6 md:items-center gap-3 md:gap-0 px-4 py-5 hover:bg-muted/50 transition"
            >
              <div className="md:col-span-1">
                <div
                  className={`font-semibold transition-all ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-xs text-muted-foreground">
                    {task.description}
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {task.dueDate
                  ? format(new Date(task.dueDate), "dd MMM yyyy")
                  : "No Due Date"}
              </div>

              <div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="text-sm">{task.status}</div>

              <div className="flex items-center md:pl-6">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCompleteToggle(task)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="md:hidden ml-2"> Completed </span>
              </div>

              <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setViewTask(task)}>
                      👁 View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditTask(task)}>
                      ✏️ Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(task._id)}
                      className="text-red-600"
                    >
                      🗑 Delete
                    </DropdownMenuItem>
                    {!task.archived ? (
                      <DropdownMenuItem
                        onClick={async () => {
                          await fetch(`/api/tasks/${task._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ archived: true }),
                          });
                          fetchTasks();
                        }}
                      >
                        🗃 Archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={async () => {
                          await fetch(`/api/tasks/${task._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ archived: false }),
                          });
                          fetchTasks();
                        }}
                      >
                        ♻️ Restore
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-6">
              No tasks found
            </p>
          )}
        </div>

        {viewTask && (
          <ViewTaskDialog task={viewTask} onClose={() => setViewTask(null)} />
        )}

        {editTask && (
          <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <AddTask
                defaultValues={editTask}
                onSuccess={() => {
                  setEditTask(null);
                  fetchTasks();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
