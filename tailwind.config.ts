import type {Config} from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        md: '72px',
      },
      screens: {
        DEFAULT: '1440px',
      },
    },
    extend: {
      fontFamily: {
        wix: ['Wix Madefor Display', 'sans-serif'],
        namecat: ['Namecat', 'sans-serif'],
      },
      backgroundImage: {
        hero: 'url("/assets/images/hero.jpg")',
        'gradient-radial':
          'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        start: 'rgba(240, 189, 47, 0.05)',
        end: 'rgba(57, 211, 200, 0.05)',
      },
      colors: {
        'gradient-yellow': 'rgba(240, 189, 47, 0.05)',
        'gradient-teal': 'rgba(57, 211, 200, 0.05)',
        'gradient-gray': '#1B1C1D',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        black: '#000000',
        white: '#FFFFFF',
        g: {
          800: '#1B1C1D',
          700: '#25272D',
          600: '#7B7B7B',
          500: '#A3A3A3',
          400: '#D9D9D9',
        },
        c: {
          700: '#20746E',
          600: '#2DA69D',
          500: '#39D3C8',
          400: '#3FEDE0',
          100: '#CDFFFB',
        },
        y: {
          500: '#F0BD2F',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
