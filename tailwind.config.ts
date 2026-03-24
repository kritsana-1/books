import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                error: {
                    500: '#ef4444', // นี่คือสีแดงของ Tailwind
                },
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    500: '#1E40AF',
                    600: '#1e3a8a',
                    700: '#1d35a0',
                },
                secondary: {
                    50: '#f8fafc',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                },
                success: {
                    500: '#10B981',
                    600: '#059669',
                },
                destructive: {
                    500: '#EF4444',
                    600: '#dc2626',
                },
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    500: '#6B7280',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'sans-serif'],
            },
            fontSize: {
                xs: ['12px', { lineHeight: '16px' }],
                sm: ['14px', { lineHeight: '20px' }],
                base: ['16px', { lineHeight: '24px' }],
                lg: ['18px', { lineHeight: '28px' }],
                xl: ['20px', { lineHeight: '28px' }],
                '2xl': ['24px', { lineHeight: '32px' }],
                '3xl': ['30px', { lineHeight: '36px' }],
                '4xl': ['36px', { lineHeight: '40px' }],
            },
            spacing: {
                '4.5': '1.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '18': '4.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-in-out',
                'scale-pulse': 'scalePulse 0.4s ease-in-out',
                'bounce-in': 'bounceIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scalePulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            borderRadius: {
                xl: '0.75rem',
                '2xl': '1rem',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
