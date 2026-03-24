'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Camera,
  BookOpen,
  Heart,
  MessageCircle,
  Award,
  Edit2,
  LogOut,
} from 'react-icons/fa';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    location: 'San Francisco, CA',
    bio: 'Book lover, coffee enthusiast, and lifelong learner. I love exploring different genres and discovering new authors.',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Save profile changes to Supabase
    setIsEditing(false);
  };

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
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="text-white w-16 h-16" />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-neutral-900">{formData.fullName}</h1>
                <p className="text-neutral-600 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {formData.location}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      Save Changes
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
                    <button className="btn btn-outline flex items-center gap-2">
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
              <p className="text-neutral-700 mb-6">{formData.bio}</p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-primary-600">24</p>
                <p className="text-sm text-neutral-600">Books Read</p>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-secondary-600">156</p>
                <p className="text-sm text-neutral-600">Favorites</p>
              </div>

              <div className="bg-success-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-success-600">48</p>
                <p className="text-sm text-neutral-600">Reviews</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="text-white w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-sm text-neutral-600">Badges</p>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 flex overflow-x-auto">
            <button className="flex-1 px-6 py-4 text-center font-medium text-primary-500 border-b-2 border-primary-500 hover:text-primary-600">
              <BookOpen className="w-5 h-5 inline mr-2" />
              My Library (24)
            </button>
            <button className="flex-1 px-6 py-4 text-center font-medium text-neutral-600 hover:text-neutral-900">
              <Heart className="w-5 h-5 inline mr-2" />
              Favorites (156)
            </button>
            <button className="flex-1 px-6 py-4 text-center font-medium text-neutral-600 hover:text-neutral-900">
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Reviews (48)
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
