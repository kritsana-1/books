import Hero from '@/components/home/Hero';
import CategoryFilter from '@/components/home/CategoryFilter';
import BookGrid from '@/components/books/BookGrid';
import { metadata } from './layout';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <Hero />

      {/* Category Filter Section */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 z-40">
        <CategoryFilter />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recommended For You Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Recommended For You
              </h2>
              <p className="text-neutral-600 mt-2">
                Personalized picks based on your interests
              </p>
            </div>
            <a
              href="/books?filter=recommended"
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              See All →
            </a>
          </div>
          <BookGrid category="recommended" />
        </section>

        {/* New Releases Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                New Releases
              </h2>
              <p className="text-neutral-600 mt-2">
                Latest books from the last 30 days
              </p>
            </div>
            <a
              href="/books?filter=new"
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              See All →
            </a>
          </div>
          <BookGrid category="new-releases" />
        </section>

        {/* Top Rated Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Top Rated Books
              </h2>
              <p className="text-neutral-600 mt-2">
                Most loved books from our community
              </p>
            </div>
            <a
              href="/books?filter=top-rated"
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              See All →
            </a>
          </div>
          <BookGrid category="top-rated" />
        </section>
      </div>
    </div>
  );
}
