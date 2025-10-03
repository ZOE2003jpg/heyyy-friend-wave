import { Link } from 'react-router-dom'
import { KanbanSquare, Users, Zap, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <KanbanSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Kanban SaaS</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Manage Projects with Ease
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The most intuitive kanban board for teams. Organize tasks, collaborate seamlessly, and boost productivity.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 text-lg font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Kanban SaaS?</h2>
          <p className="text-muted-foreground">Everything you need to manage your projects effectively</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Drag and drop tasks instantly with our optimized performance and real-time updates.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Work together seamlessly with real-time collaboration and task assignments.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Your data is protected with industry-leading security and encryption standards.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            © 2025 Kanban SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
