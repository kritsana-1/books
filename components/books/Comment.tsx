'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Trash2, Flag } from 'react-icons/fa';

interface CommentProps {
  commentId: number;
  author: string;
  rating?: number;
  text: string;
  timestamp: string;
  likes: number;
  replies?: CommentProps[];
  onReply?: (parentId: number) => void;
  onDelete?: (commentId: number) => void;
}

export default function Comment({
  commentId,
  author,
  rating,
  text,
  timestamp,
  likes,
  replies = [],
  onReply,
  onDelete,
}: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Comment */}
      <div className="pb-6 border-b border-neutral-200 last:pb-0 last:border-b-0">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex-shrink-0"></div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-neutral-900">{author}</h3>
              {rating && <span className="text-secondary-500 font-semibold">⭐ {rating}</span>}
            </div>

            <p className="text-neutral-700 text-sm mb-3 leading-relaxed">{text}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:text-primary-500 transition-colors flex items-center gap-1 ${
                  isLiked ? 'text-primary-500' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                Helpful{isLiked && 'd'} ({likes || 0})
              </button>

              <button
                onClick={() => onReply?.(commentId)}
                className="hover:text-primary-500 transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>

              <span>{timestamp}</span>

              <button
                onClick={() => onDelete?.(commentId)}
                className="hover:text-error-500 transition-colors flex items-center gap-1 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button className="hover:text-error-500 transition-colors flex items-center gap-1">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-12 space-y-6">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </button>

          {showReplies &&
            replies.map((reply) => (
              <div key={reply.commentId} className="pb-6 border-b border-neutral-200 last:pb-0 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-neutral-900 text-sm">{reply.author}</h4>
                      {reply.rating && (
                        <span className="text-secondary-500 font-semibold text-sm">⭐ {reply.rating}</span>
                      )}
                    </div>
                    <p className="text-neutral-600 text-sm mb-2 leading-relaxed">{reply.text}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="hover:text-primary-500 transition-colors flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3" />
                        {reply.likes}
                      </button>
                      <span>{reply.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
