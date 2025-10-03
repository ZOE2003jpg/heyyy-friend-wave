import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DndContext, closestCorners, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { ArrowLeft, Plus, MoreVertical } from 'lucide-react'
import KanbanColumn from '../components/KanbanColumn'
import TaskCard from '../components/TaskCard'

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

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: '1', title: 'Design new landing page', description: 'Create mockups for the new homepage', priority: 'high', assignee: 'JD' },
      { id: '2', title: 'Update documentation', description: 'Add API documentation', priority: 'medium', assignee: 'AS' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: '3', title: 'Implement authentication', description: 'Add login and registration', priority: 'high', assignee: 'MK' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      { id: '4', title: 'Code review for PR #123', description: 'Review changes in pull request', priority: 'medium', assignee: 'JD' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: '5', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions', priority: 'low', assignee: 'AS' },
    ],
  },
]

export default function BoardPage() {
  const { id } = useParams()
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = columns
      .flatMap(col => col.tasks)
      .find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id as string
    const overColumnId = over.id as string

    // Find source column and task
    const sourceColumn = columns.find(col => 
      col.tasks.some(task => task.id === activeTaskId)
    )
    
    if (!sourceColumn) return

    const task = sourceColumn.tasks.find(t => t.id === activeTaskId)
    if (!task) return

    // If dropped on the same column, do nothing
    if (sourceColumn.id === overColumnId) return

    // Move task to new column
    setColumns(cols => {
      return cols.map(col => {
        if (col.id === sourceColumn.id) {
          // Remove from source
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== activeTaskId)
          }
        } else if (col.id === overColumnId) {
          // Add to destination
          return {
            ...col,
            tasks: [...col.tasks, task]
          }
        }
        return col
      })
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Marketing Campaign</h1>
                <p className="text-sm text-muted-foreground">Board #{id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </button>
              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="p-6 overflow-x-auto">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="opacity-50">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  )
}
