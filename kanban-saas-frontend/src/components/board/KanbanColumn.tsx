import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

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

interface KanbanColumnProps {
  column: Column;
  onCardClick: (card: Card) => void;
}

const KanbanColumn = ({ column, onCardClick }: KanbanColumnProps) => {
  const { id, name, cards } = column;
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className="bg-white rounded-xl shadow-md p-4 flex flex-col min-w-[320px] w-80 h-full border border-gray-200"
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
          {cards.length}
        </span>
      </div>
      
      <SortableContext items={cards.map(c => c.id)}>
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {cards.map(card => (
            <div key={card.id} onClick={() => onCardClick(card)}>
              <KanbanCard card={card} />
            </div>
          ))}
        </div>
      </SortableContext>
      
      <button className="mt-4 w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
        <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Card
      </button>
    </div>
  );
};

export default KanbanColumn;