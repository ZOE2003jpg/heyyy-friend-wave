import { useState, useEffect } from 'react';
import { cardsService } from '../../services/api';

interface Card {
  id: string;
  title: string;
  description: string;
  position: number;
  column_id: string;
  due_date?: string;
  priority?: string;
  labels?: string[];
  comments?: Comment[];
  attachments?: Attachment[];
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface Attachment {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
  onUpdate: () => void;
}

const CardDetailModal = ({ card, onClose, onUpdate }: CardDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(card.comments || []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await cardsService.updateCard(card.id, {
        title: editedCard.title,
        description: editedCard.description,
        due_date: editedCard.due_date,
        priority: editedCard.priority,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to update card:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // In real app, call API to add comment
      // const { data } = await commentsService.addComment(card.id, { content: newComment });
      // setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const priorityColors = {
    high: 'bg-accent-100 text-accent-800 border-accent-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-success-100 text-success-800 border-success-300',
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-container">
          <div className="modal-panel max-w-4xl scale-in">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCard.title}
                    onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                    className="input text-2xl font-bold"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{card.title}</h2>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedCard.description}
                        onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                        className="input"
                        rows={4}
                        placeholder="Add a description..."
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={loading}>
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {card.description || 'No description provided'}
                    </p>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comments
                  </h3>

                  <form onSubmit={handleAddComment} className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="input"
                        placeholder="Add a comment..."
                      />
                      <button type="submit" className="btn btn-primary">
                        Post
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                              {comment.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{comment.user.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div>
                  <label className="label">Priority</label>
                  <select
                    value={editedCard.priority || ''}
                    onChange={(e) => setEditedCard({ ...editedCard, priority: e.target.value })}
                    className="input"
                  >
                    <option value="">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {card.priority && (
                    <span className={`badge mt-2 ${priorityColors[card.priority as keyof typeof priorityColors] || 'badge-gray'}`}>
                      {card.priority}
                    </span>
                  )}
                </div>

                <div>
                  <label className="label">Due Date</label>
                  <input
                    type="date"
                    value={editedCard.due_date || ''}
                    onChange={(e) => setEditedCard({ ...editedCard, due_date: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <h4 className="label">Labels</h4>
                  <div className="flex flex-wrap gap-2">
                    {card.labels && card.labels.length > 0 ? (
                      card.labels.map((label, index) => (
                        <span key={index} className="badge badge-primary">
                          {label}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No labels</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="label">Attachments</h4>
                  {card.attachments && card.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {card.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate flex-1">{attachment.filename}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No attachments</p>
                  )}
                  <button className="btn btn-secondary btn-sm w-full mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Attachment
                  </button>
                </div>

                <button className="btn btn-accent btn-sm w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardDetailModal;
