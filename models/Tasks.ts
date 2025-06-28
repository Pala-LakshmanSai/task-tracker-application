import { Schema, Document, models, model, Model } from 'mongoose'

export interface SubtaskInterface {
  title: string
  completed: boolean
}

export interface TaskInterface extends Document {
  title: string
  description?: string
  dueDate: Date
  priority: 'Low' | 'Medium' | 'High'
  status: 'To Do' | 'In Progress' | 'Done'
  completed: boolean
  archived: boolean
  subtasks?: SubtaskInterface[]
  createdAt: Date
  updatedAt: Date
  userId: String
}

const SubtaskSchema = new Schema<SubtaskInterface>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
})

const TaskSchema = new Schema<TaskInterface>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    subtasks: [SubtaskSchema],
    userId: { type: String, ref: 'User', required: true }
  },
  { timestamps: true }
)

const TaskModel: Model<TaskInterface> = models.Task || model<TaskInterface>('Task', TaskSchema)

export default TaskModel; 

