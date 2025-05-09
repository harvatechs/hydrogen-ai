import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        glassy: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.2)',
          light: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        backgroundColor: {
          'light-highlight': '#f3f4f6',
          'dark-highlight': 'rgba(75, 85, 99, 0.2)',
        },
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'gemini-purple': '#a142f4',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(8px)' }
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'typing': {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        'wave': {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'typing': 'typing 2s steps(20, end) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear'
      },
      backgroundImage: {
        'glassy-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'yellow-gradient': 'linear-gradient(to bottom right, #000000, #222222 70%, #FEF7CD)',
        'yellow-light-gradient': 'linear-gradient(to bottom right, #222222, #FEF7CD)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(254, 247, 205, 0.15) 0%, transparent 70%)',
        'light-glow': 'radial-gradient(circle at center, rgba(243, 244, 246, 0.7) 0%, rgba(243, 244, 246, 0.1) 70%, transparent 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 75%, rgba(255,255,255,0) 100%)',
        'gemini-gradient': 'linear-gradient(to right, #a142f4, #6a5acd)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'var(--tw-prose-body)',
            '[class~="lead"]': {
              color: 'var(--tw-prose-lead)'
            },
            strong: {
              color: 'var(--tw-prose-bold)'
            },
            'ol > li::marker': {
              color: 'var(--tw-prose-counters)'
            },
            'ul > li::marker': {
              color: 'var(--tw-prose-bullets)'
            },
            hr: {
              borderColor: 'var(--tw-prose-hr)'
            },
            blockquote: {
              color: 'var(--tw-prose-quotes)',
              borderLeftColor: 'var(--tw-prose-quote-borders)'
            },
            h1: {
              color: 'var(--tw-prose-headings)'
            },
            h2: {
              color: 'var(--tw-prose-headings)'
            },
            h3: {
              color: 'var(--tw-prose-headings)'
            },
            h4: {
              color: 'var(--tw-prose-headings)'
            },
            'figure figcaption': {
              color: 'var(--tw-prose-captions)'
            },
            code: {
              color: 'var(--tw-prose-code)'
            },
            'a code': {
              color: 'var(--tw-prose-links)'
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)'
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit'
            },
            thead: {
              color: 'var(--tw-prose-th-borders)',
              borderBottomColor: 'var(--tw-prose-th-borders)'
            },
            'tbody tr': {
              borderBottomColor: 'var(--tw-prose-td-borders)'
            }
          }
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate")
  ],
} satisfies Config;
