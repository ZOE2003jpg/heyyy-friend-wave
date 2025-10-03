import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  assignee?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col w-80 bg-muted/30 rounded-lg">
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{column.title}</h3>
          <span className="text-sm text-muted-foreground">{column.tasks.length}</span>
        </div>
        <button className="w-full py-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-md hover:border-primary transition-colors flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 min-h-[500px] transition-colors ${
          isOver ? 'bg-primary/5' : ''
        }`}
      >
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
