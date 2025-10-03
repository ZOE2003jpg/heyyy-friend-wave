import { useState, useEffect } from 'react';
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { boardService } from '../../services/api';

interface Card {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        // For demo purposes, create mock data
        setColumns([
          {
            id: '1',
            title: 'To Do',
            cards: [
              { id: '1', title: 'Research competitors', description: 'Analyze top 5 competitors', order: 0 },
              { id: '2', title: 'Design mockups', description: 'Create initial UI designs', order: 1 }
            ]
          },
          {
            id: '2',
            title: 'In Progress',
            cards: [
              { id: '3', title: 'Implement authentication', description: 'Set up user login and registration', order: 0 }
            ]
          },
          {
            id: '3',
            title: 'Done',
            cards: [
              { id: '4', title: 'Project setup', description: 'Initialize repository and project structure', order: 0 }
            ]
          }
        ]);
        
        // In a real app, we would fetch from API:
        // const { data } = await boardService.getBoard(boardId);
        // setColumns(data.columns);
      } catch (err: any) {
        setError(err.message || 'Failed to load board');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns containing the cards
    const activeColumnIndex = columns.findIndex(col => 
      col.cards.some(card => card.id === activeId)
    );
    
    const overColumnIndex = columns.findIndex(col => 
      col.cards.some(card => card.id === overId) || col.id === overId
    );
    
    if (activeColumnIndex === -1) return;
    
    const activeColumn = columns[activeColumnIndex];
    const overColumn = columns[overColumnIndex];
    
    // Find the card in the active column
    const activeCardIndex = activeColumn.cards.findIndex(card => card.id === activeId);
    const activeCard = activeColumn.cards[activeCardIndex];
    
    // Create a new columns array to update state
    const newColumns = [...columns];
    
    // Remove the card from the active column
    newColumns[activeColumnIndex].cards = activeColumn.cards.filter(card => card.id !== activeId);
    
    // If dropping on a column directly
    if (overId === overColumn.id) {
      // Add the card to the end of the over column
      newColumns[overColumnIndex].cards.push(activeCard);
    } else {
      // Find the position of the over card
      const overCardIndex = overColumn.cards.findIndex(card => card.id === overId);
      
      // Insert the active card at the position of the over card
      newColumns[overColumnIndex].cards.splice(overCardIndex, 0, activeCard);
    }
    
    setColumns(newColumns);
    
    // In a real app, we would update the API:
    // boardService.moveCard(activeId, overColumnIndex, newPosition);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <button className="btn btn-primary">
          Add Column
        </button>
      </div>
      
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;