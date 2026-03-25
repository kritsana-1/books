'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Heart,
  MessageCircle,
  Award,
  Edit2,
  LogOut,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile, getUserReadingStats, setReadingGoal, getReadingGoal } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, signOut: authSignOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [readingStats, setReadingStats] = useState({
    total_favorites: 0,
    total_read: 0,
    average_rating: 0,
    total_rated: 0,
  });
  const [readingGoal, setReadingGoalState] = useState<{ goal_count: number; goal_year: number } | null>(null);
  const [goalCount, setGoalCount] = useState(50);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    } else if (profile) {
      loadReadingStats();
    }
  }, [user, router, profile]);

  const loadReadingStats = async () => {
    if (!profile) return;
    try {
      const stats = await getUserReadingStats(profile.user_id);
      setReadingStats(stats);
      
      const currentYear = new Date().getFullYear();
      const goal = await getReadingGoal(profile.user_id, currentYear);
      if (goal) {
        setReadingGoalState(goal);
        setGoalCount(goal.goal_count);
      }
    } catch (err) {
      console.error('Error loading reading stats:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      await updateUserProfile(profile.user_id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSaveReadingGoal = async () => {
    if (!profile || !goalCount || goalCount < 1) return;

    setIsSavingGoal(true);
    try {
      const currentYear = new Date().getFullYear();
      await setReadingGoal(profile.user_id, currentYear, goalCount);
      setReadingGoalState({ goal_count: goalCount, goal_year: currentYear });
      setIsEditingGoal(false);
      setShareMessage('Reading goal updated successfully!');
      setTimeout(() => setShareMessage(null), 2000);
    } catch (err) {
      console.error('Error saving goal:', err);
      setShareMessage('Failed to save goal.');
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleShareStats = async () => {
    const statsText = `📚 My 2026 Reading Stats:\n• Books Read: ${readingStats.total_read}${
      readingGoal ? `/${readingGoal.goal_count}` : ''
    }\n• Favorites: ${readingStats.total_favorites}\n• Avg Rating: ${readingStats.average_rating}⭐\n\nJoin me on BookHub! 🎉`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Reading Stats',
          text: statsText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(statsText);
      setShareMessage('Stats copied to clipboard!');
      setTimeout(() => setShareMessage(null), 2000);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

          {/* Profile Content */}
          <div className="relative px-6 sm:px-8 pb-8">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 mb-8 -mt-16">
              <div className="relative z-10 mb-4 sm:mb-0">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold">
                  {(profile?.first_name?.[0] || formData.username?.[0] || 'U').toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-neutral-900">{profile?.first_name} {profile?.last_name}</h1>
                <p className="text-neutral-600 mt-1">@{profile?.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn btn-primary"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button onClick={handleSignOut} className="btn btn-outline flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input w-full h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <p className="text-neutral-700 mb-6">{formData.bio || 'No bio yet. Edit your profile to add one.'}</p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-primary-600">{readingStats.total_read}</p>
                <p className="text-sm text-neutral-600">Books Read</p>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-secondary-600">{readingStats.total_favorites}</p>
                <p className="text-sm text-neutral-600">Favorites</p>
              </div>

              <div className="bg-success-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-success-600">{readingStats.total_rated}</p>
                <p className="text-sm text-neutral-600">Ratings</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{readingStats.average_rating.toFixed(1)}</p>
                <p className="text-sm text-neutral-600">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Edit Profile</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="input w-full h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading Goals Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">2026 Reading Goal</h2>
            {!isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="btn btn-primary text-sm"
              >
                Edit Goal
              </button>
            )}
          </div>

          {isEditingGoal ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Books to Read This Year
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={goalCount}
                    onChange={(e) => setGoalCount(parseInt(e.target.value) || 0)}
                    className="input flex-1"
                  />
                  <button
                    onClick={handleSaveReadingGoal}
                    disabled={isSavingGoal}
                    className="btn btn-primary"
                  >
                    {isSavingGoal ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditingGoal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-neutral-900">
                    {readingStats.total_read} / {readingGoal?.goal_count || 50} books
                  </span>
                  <span className="text-sm font-medium text-neutral-600">
                    {readingGoal ? Math.round((readingStats.total_read / readingGoal.goal_count) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full transition-all duration-500"
                    style={{
                      width: `${
                        readingGoal
                          ? Math.min((readingStats.total_read / readingGoal.goal_count) * 100, 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-neutral-600">
                {readingGoal && readingStats.total_read < readingGoal.goal_count
                  ? `Keep going! ${readingGoal.goal_count - readingStats.total_read} more to go.`
                  : readingGoal && readingStats.total_read >= readingGoal.goal_count
                  ? '🎉 Goal achieved! Great job!'
                  : 'Set a goal to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Share Stats Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Share Your Stats</h2>
          <p className="text-neutral-600 mb-4">
            Let your friends know about your reading progress on BookHub!
          </p>
          <button
            onClick={handleShareStats}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            📤 Share Reading Stats
          </button>
          {shareMessage && (
            <p className="mt-3 text-sm text-success-600 font-medium">{shareMessage}</p>
          )}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 flex overflow-x-auto">
            <button className="flex-1 px-6 py-4 text-center font-medium text-primary-500 border-b-2 border-primary-500 hover:text-primary-600">
              <BookOpen className="w-5 h-5 inline mr-2" />
              My Library ({readingStats.total_read})
            </button>
            <button className="flex-1 px-6 py-4 text-center font-medium text-neutral-600 hover:text-neutral-900">
              <Heart className="w-5 h-5 inline mr-2" />
              Favorites ({readingStats.total_favorites})
            </button>
            <button className="flex-1 px-6 py-4 text-center font-medium text-neutral-600 hover:text-neutral-900">
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Ratings ({readingStats.total_rated})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sample Book Cards */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="card group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="bg-gradient-to-br from-primary-500 to-secondary-500 h-48 flex items-end justify-center p-4">
                    <p className="text-white text-sm font-medium">Book {i}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-neutral-900 line-clamp-2 mb-2">
                      Sample Book Title {i}
                    </h3>
                    <p className="text-secondary-500 font-bold text-lg">$16.99</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-secondary-500">⭐ 4.8</span>
                      <span className="text-neutral-400 text-xs">(234)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Account Settings</h2>

          <div className="space-y-6">
            {/* Email Preferences */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <h3 className="font-medium text-neutral-900">Email Notifications</h3>
                <p className="text-sm text-neutral-600">Receive updates about new releases and community activities</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <h3 className="font-medium text-neutral-900">Public Profile</h3>
                <p className="text-sm text-neutral-600">Let other users see your profile and library</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>

            {/* Password Change */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="font-medium text-neutral-900 mb-4">Change Password</h3>
              <Link href="/auth/change-password" className="text-primary-500 hover:text-primary-600 font-medium">
                Update your password →
              </Link>
            </div>

            {/* Delete Account */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="font-medium text-error-600 mb-4">Danger Zone</h3>
              <button className="btn btn-outline text-error-600 border-error-300 hover:bg-error-50">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
