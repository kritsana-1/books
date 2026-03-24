'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/supabase';
import type { Category } from '@/lib/types';

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton h-10 w-24 rounded-full flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-sm font-semibold text-neutral-600 flex-shrink-0">
          Genres:
        </span>

        {/* All Categories Button */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
            selectedCategory === null
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All Books
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === category.slug
                ? 'text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            style={{
              backgroundColor:
                selectedCategory === category.slug
                  ? category.color_code || '#1e40af'
                  : undefined,
            }}
          >
            {category.name}
          </button>
        ))}

        {/* More Button */}
        {categories.length > 5 && (
          <button className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium text-sm whitespace-nowrap transition-all flex-shrink-0">
            +{categories.length - 5} More
          </button>
        )}
      </div>
    </div>
  );
}
