import { Link } from 'react-router-dom'
import { KanbanSquare, Plus, Calendar, Users } from 'lucide-react'

const mockBoards = [
  { id: '1', name: 'Marketing Campaign', tasks: 12, members: 5, color: 'bg-blue-500' },
  { id: '2', name: 'Product Development', tasks: 24, members: 8, color: 'bg-purple-500' },
  { id: '3', name: 'Customer Support', tasks: 8, members: 3, color: 'bg-green-500' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <KanbanSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Kanban SaaS</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Boards</h1>
            <p className="text-muted-foreground">Manage and organize your projects</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Plus className="h-5 w-5" />
            New Board
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBoards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`h-12 w-12 ${board.color} rounded-lg flex items-center justify-center`}>
                  <KanbanSquare className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-1">{board.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{board.tasks} tasks</span>
                <span>•</span>
                <span>{board.members} members</span>
              </div>
            </Link>
          ))}

          {/* Create New Board Card */}
          <button className="bg-card border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-muted/30 transition-colors flex flex-col items-center justify-center min-h-[160px]">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-muted-foreground font-medium">Create New Board</span>
          </button>
        </div>
      </main>
    </div>
  )
}
