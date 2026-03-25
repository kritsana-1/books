'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <FiHeart className="w-6 h-6 text-error-500" />
            <span className="text-xl font-bold text-primary-500">BookHub</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search books, authors..."
                className="input pl-10"
              />
              <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/books"
              className="text-neutral-600 hover:text-primary-500 font-medium text-sm"
            >
              Discover Books
            </Link>
            <Link
              href="/events"
              className="text-neutral-600 hover:text-primary-500 font-medium text-sm"
            >
              Events
            </Link>
            <Link
              href="/community"
              className="text-neutral-600 hover:text-primary-500 font-medium text-sm"
            >
              Community
            </Link>
            <Link
              href="/library"
              className="text-neutral-600 hover:text-primary-500 font-medium text-sm"
            >
              My Library
            </Link>
          </div>

          {/* Auth & User Menu */}
          <div className="flex items-center gap-3 ml-4">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <FiSearch className="w-5 h-5 text-neutral-600 md:hidden" />
            </button>
            <Link
              href="/auth/signin"
              className="hidden sm:block text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="btn btn-primary hidden sm:block text-sm px-4 py-2"
            >
              Sign Up
            </Link>
            <Link
              href="/profile"
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors hidden sm:block"
            >
              <FiUser className="w-5 h-5 text-neutral-600" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors md:hidden"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 text-neutral-600" />
              ) : (
                <FiMenu className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
            <Link
              href="/books"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg font-medium"
            >
              Discover Books
            </Link>
            <Link
              href="/events"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg font-medium"
            >
              Events
            </Link>
            <Link
              href="/community"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg font-medium"
            >
              Community
            </Link>
            <Link
              href="/library"
              className="block px-4 py-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 rounded-lg font-medium"
            >
              My Library
            </Link>
            <div className="border-t border-neutral-200 pt-3">
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-white bg-primary-500 hover:bg-primary-600 rounded-lg font-medium mt-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
