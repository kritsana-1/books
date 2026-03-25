'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Plus } from 'lucide-react';
import { getCommunityPosts, createCommunityPost } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface CommunityPost {
  post_id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creating, setCreating] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      try {
        const data = await getCommunityPosts();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data as CommunityPost[]);
        } else {
          setPosts([]);
        }
      } catch (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!profile) {
      alert('Please sign in to create posts.');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Please fill in both title and content.');
      return;
    }

    setCreating(true);
    try {
      const newPost = await createCommunityPost(profile.user_id, newPostTitle.trim(), newPostContent.trim());
      setPosts(prev => [newPost, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-600">Loading community feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900">Community</h1>
            <p className="text-neutral-600 mt-2">Share your reading insights, questions and events with other members.</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>

        <div className="space-y-5">
          {posts.map((post) => (
            <div key={post.post_id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{post.title}</h2>
                  <p className="text-neutral-600 mt-1 line-clamp-2">{post.content}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-neutral-500">by {post.user.username}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-neutral-500 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Create New Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter post title..."
                  maxLength={200}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Content</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                  placeholder="Share your thoughts..."
                  maxLength={2000}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn btn-outline"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={creating || !newPostTitle.trim() || !newPostContent.trim()}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
              >
                {creating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {creating ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
