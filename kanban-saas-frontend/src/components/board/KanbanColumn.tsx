import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCard from './KanbanCard';

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

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { id, title, cards } = column;

  return (
    <div 
      className="bg-gray-100 rounded-lg shadow p-4 flex flex-col h-[calc(100vh-200px)]"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
          {cards.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {cards.map(card => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>
      
      <button className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        + Add Card
      </button>
    </div>
  );
};

export default KanbanColumn;