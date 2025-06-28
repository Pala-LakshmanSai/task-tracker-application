'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { DialogClose } from '@/components/ui/dialog'
import { TaskInterface } from '@/models/Tasks'

interface Props {
  onSuccess: () => void
  defaultValues?: TaskInterface
}

export default function AddTask({ onSuccess, defaultValues }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Pre-fill in edit mode
  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title)
      setDescription(defaultValues.description || '')
      setPriority(defaultValues.priority)
      setStatus(defaultValues.status)
      setDueDate(defaultValues.dueDate ? new Date(defaultValues.dueDate) : undefined)
      setSubtasks(defaultValues.subtasks || [])
    }
  }, [defaultValues])

  const handleSubtaskChange = (index: number, value: string) => {
    const updated = [...subtasks]
    updated[index].title = value
    setSubtasks(updated)
  }

  const addSubtask = () => setSubtasks([...subtasks, { title: '' }])
  const removeSubtask = (index: number) => setSubtasks(subtasks.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    if (!title || !priority || !status) {
      setError('Please fill all required fields')
      setLoading(false)
      return
    }

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate?.toISOString().split('T')[0],
      subtasks: subtasks.filter((s) => s.title.trim() !== ''),
    }

    try {
      const res = await fetch(
        defaultValues?._id ? `/api/tasks/${defaultValues._id}` : '/api/tasks',
        {
          method: defaultValues?._id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        setError('Something went wrong')
        setLoading(false)
        return
      }

      onSuccess()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="flex gap-4">
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
        {dueDate && <p className="text-sm text-muted-foreground">{format(dueDate, 'dd MMM yyyy')}</p>}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Subtasks</p>
        {subtasks.map((sub, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={sub.title}
              onChange={(e) => handleSubtaskChange(index, e.target.value)}
              placeholder={`Subtask ${index + 1}`}
            />
            <Button size="icon" variant="ghost" onClick={() => removeSubtask(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
          <Plus className="w-4 h-4 mr-1" /> Add Subtask
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : defaultValues?._id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </div>
  )
}
