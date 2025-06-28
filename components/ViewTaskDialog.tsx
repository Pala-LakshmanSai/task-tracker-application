'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TaskInterface } from '@/models/Tasks'

interface ViewTaskDialogProps {
  task: TaskInterface | null
  onClose: () => void
}

export default function ViewTaskDialog({ task, onClose }: ViewTaskDialogProps) {
  if (!task) return null

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        <p className="text-sm">
          <span className="font-medium">Due:</span>{' '}
          {task.dueDate ? new Date(task.dueDate).toDateString() : 'No due date'}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span> {task.status}
        </p>
        <p className="text-sm">
          <span className="font-medium">Priority:</span> {task.priority}
        </p>

        {task.subtasks?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-2">Subtasks:</p>
            <ul className="list-disc pl-5 space-y-1">
              {task.subtasks.map((sub, i) => (
                <li key={i} className={sub.completed ? 'line-through' : ''}>
                  {sub.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
