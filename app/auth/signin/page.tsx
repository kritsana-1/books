'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Github, Mail, Lock, User, ArrowRight } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase sign-in call
      // const { error } = await signInWithEmail(email, password);
      // if (error) throw error;
      
      console.log('Sign in with:', email, password);
      // router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase OAuth call
      // const { error } = await signInWithGoogle();
      // if (error) throw error;
      
      console.log('Sign in with Google');
      // router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase OAuth call
      // const { error } = await signInWithGithub();
      // if (error) throw error;
      
      console.log('Sign in with GitHub');
      // router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Heart className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">BookHub</h1>
          </div>
          <p className="text-neutral-600">Welcome back to your reading community</p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
              {error}
            </div>
          )}

          {/* Email Sign In */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4 rounded" disabled={isLoading} />
                <span className="text-neutral-700">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-600">or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="hidden sm:inline">Google</span>
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="btn btn-outline flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary-500 hover:text-primary-600 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-neutral-600 space-y-1">
          <p>
            <Link href="/privacy" className="hover:text-neutral-900 underline">
              Privacy Policy
            </Link>
            {' • '}
            <Link href="/terms" className="hover:text-neutral-900 underline">
              Terms of Service
            </Link>
          </p>
          <p>
            <Link href="/" className="hover:text-neutral-900 underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
