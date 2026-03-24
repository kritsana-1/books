'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface HeroBook {
  id: number;
  title: string;
  author: string;
  image: string;
  description: string;
  link: string;
}

const HERO_BOOKS: HeroBook[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    image:
      'https://covers.openlibrary.org/b/id/8247084-M.jpg',
    description:
      'Transform your life with tiny changes that deliver remarkable results.',
    link: '/books/1',
  },
  {
    id: 2,
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    image:
      'https://covers.openlibrary.org/b/id/8248849-M.jpg',
    description: 'Unlock the secret to self-control and habit formation.',
    link: '/books/2',
  },
  {
    id: 3,
    title: 'Tiny Habits',
    author: 'BJ Fogg',
    image:
      'https://covers.openlibrary.org/b/id/8383166-M.jpg',
    description:
      'The easiest way to build new habits and break old ones forever.',
    link: '/books/3',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index % HERO_BOOKS.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BOOKS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_BOOKS.length) % HERO_BOOKS.length);
  };

  const book = HERO_BOOKS[currentSlide];

  return (
    <section className="relative bg-gradient-to-r from-primary-500 to-primary-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-white z-10">
            <span className="inline-block bg-white bg-opacity-20 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Trending This Week
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {book.title}
            </h1>

            <p className="text-lg text-white text-opacity-90 mb-2">
              by {book.author}
            </p>

            <p className="text-white text-opacity-80 text-lg mb-8 leading-relaxed">
              {book.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={book.link} className="btn bg-white text-primary-500 hover:bg-neutral-100">
                Read More
              </Link>
              <Link href="/books" className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10">
                Discover More Books
              </Link>
            </div>
          </div>

          {/* Book Cover Carousel */}
          <div className="relative h-96 sm:h-full flex items-center justify-center">
            {/* Book Cover */}
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 transform transition-transform duration-300">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black via-transparent to-transparent opacity-20"></div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 z-20 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-r-lg transition-all -translate-x-4 sm:-translate-x-0"
              aria-label="Previous book"
            >
              <ChevronLeft className="w-6 h-6 text-primary-500" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 z-20 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-l-lg transition-all translate-x-4 sm:translate-x-0"
              aria-label="Next book"
            >
              <ChevronRight className="w-6 h-6 text-primary-500" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {HERO_BOOKS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white bg-opacity-50 w-2 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>
    </section>
  );
}
