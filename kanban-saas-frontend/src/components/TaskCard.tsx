import { useDraggable } from '@dnd-kit/core'
import { MoreVertical } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee?: string
}

interface TaskCardProps {
  task: Task
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
}

export default function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-card-foreground flex-1">{task.title}</h4>
        <button className="p-1 hover:bg-muted rounded transition-colors">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`} />
          <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
        </div>
        {task.assignee && (
          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
            {task.assignee}
          </div>
        )}
      </div>
    </div>
  )
}
