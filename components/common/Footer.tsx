import Link from 'next/link';
import { Heart, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-100 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
            <p className="text-neutral-400">
              Get curated book recommendations and event updates delivered to your inbox
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="btn btn-primary">
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/books"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Discover Books
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="w-5 h-5 text-error-500" />
            <span className="font-bold">BookHub Community</span>
          </div>

          <p className="text-neutral-400 text-sm text-center md:text-right">
            © {currentYear} BookHub Community. All rights reserved. Made with{' '}
            <span className="text-error-500">♥</span> for book lovers.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8 pt-8 border-t border-neutral-800">
          <a
            href="https://twitter.com/bookhubcommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/bookhubcommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/bookhubcommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://github.com/bookhubcommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
