import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface KanbanCardProps {
  card: Card;
}

const KanbanCard = ({ card }: KanbanCardProps) => {
  const { id, title, description, due_date, priority, labels } = card;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: 'border-l-accent-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-success-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${priority ? priorityColors[priority as keyof typeof priorityColors] : 'border-l-gray-300'} cursor-pointer hover:shadow-md transition-all duration-200 group`}
    >
      <h4 className="font-medium text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {labels && labels.length > 0 && labels.slice(0, 2).map((label, index) => (
            <span key={index} className="badge badge-primary text-xs">
              {label}
            </span>
          ))}
          {labels && labels.length > 2 && (
            <span className="badge badge-gray text-xs">+{labels.length - 2}</span>
          )}
        </div>
        
        {due_date && (
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;