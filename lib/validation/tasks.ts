import { z } from 'zod'

export const TaskCreateSchema = z.object({

  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be a valid date (YYYY-MM-DD)'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
  subtasks: z.array(
    z.object({
      title: z.string().min(1),
      completed: z.boolean().optional(),
    })
  ).optional(),
})
