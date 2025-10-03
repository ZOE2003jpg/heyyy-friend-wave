import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCorners, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { boardsService, cardsService } from '../services/api';
import KanbanColumn from '../components/board/KanbanColumn';
import KanbanCard from '../components/board/KanbanCard';
import CardDetailModal from '../components/board/CardDetailModal';

interface Card {
  id: string;
  title: string;
  description: string;
  position: number;
  column_id: string;
  due_date?: string;
  priority?: string;
  labels?: string[];
}

interface Column {
  id: string;
  name: string;
  position: number;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

const BoardView = () => {
  const { teamId, projectId, boardId } = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (teamId && projectId && boardId) {
      fetchBoard();
    }
  }, [teamId, projectId, boardId]);

  const fetchBoard = async () => {
    if (!teamId || !projectId || !boardId) return;

    try {
      setLoading(true);
      const { data } = await boardsService.getBoard(projectId, boardId);
      setBoard(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board?.columns
      .flatMap(col => col.cards)
      .find(c => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || !board) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination columns
    const sourceColumn = board.columns.find(col =>
      col.cards.some(card => card.id === activeId)
    );
    const destColumn = board.columns.find(col =>
      col.id === overId || col.cards.some(card => card.id === overId)
    );

    if (!sourceColumn || !destColumn) return;

    const activeCard = sourceColumn.cards.find(card => card.id === activeId);
    if (!activeCard) return;

    try {
      // Update backend
      await cardsService.moveCard(activeId, {
        column_id: destColumn.id,
        position: destColumn.cards.length,
      });

      // Update local state
      fetchBoard();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to move card');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Board not found</h2>
        <Link to={`/dashboard/teams/${teamId}/projects/${projectId}`} className="text-primary-600 hover:text-primary-700">
          Back to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/teams/${teamId}/projects/${projectId}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{board.name}</h1>
        </div>
        <button className="btn btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      </div>

      {error && (
        <div className="bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 h-full">
          {board.columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCardClick={setSelectedCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-80">
              <KanbanCard card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={fetchBoard}
        />
      )}
    </div>
  );
};

export default BoardView;
