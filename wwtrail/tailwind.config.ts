import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // WW Trail Running Brand Colors (driven by --site-color-* CSS variables)
        'brand': {
          'primary': 'var(--site-color-primary)',
          'neutral': '#FFFFFF',
          'dark': 'var(--site-color-text)',
          'gray-deep': '#333333',
          'gray-light': '#F5F5F5',
          'success': 'var(--site-color-success)',
          'danger': 'var(--site-color-danger)',
        },

        // ===== WWTRAIL redesign palette (structural, fixed tokens) =====
        ink: { DEFAULT: '#0f1315', 2: '#14181a' },
        paper: '#f4f3ee',
        surface: { DEFAULT: '#ffffff', alt: '#f4f3ee' },
        hairline: '#eeece5',
        'text-muted': '#6b6f70',
        'text-faint': '#8b9295',
        // Green scale — action color is configurable via --site-color-primary
        green: {
          brand: 'var(--site-color-primary)',
          bright: '#2ea36a',
          'tint-bg': '#e9f6ef',
          'tint-border': '#bfe6d1',
        },
        // Orange — elevation / featured accents
        orange: {
          accent: '#f0a05a',
          strong: '#d1631f',
          text: '#c2733a',
          'tint-bg': '#fdf1e7',
        },

        hover: "var(--site-color-accent)",
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'Archivo', 'system-ui', 'sans-serif'],
        stat: ['var(--font-barlow)', 'Barlow Semi Condensed', 'sans-serif'],
      },
      maxWidth: {
        content: '1360px',
        'content-wide': '1600px',
      },
      borderRadius: {
        none: '0px',
        sm: '10px',
        md: '12px',
        DEFAULT: '14px',
        lg: '16px',
        xl: '18px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(20,24,26,.04)',
        card: '0 1px 2px rgba(20,24,26,.04)',
        DEFAULT: '0 1px 2px rgba(20,24,26,.04)',
        elevated: '0 12px 40px rgba(0,0,0,.35)',
        floating: '0 4px 18px rgba(0,0,0,.22)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'cloud-float': {
          'from': { transform: 'translateX(-150px)' },
          'to': { transform: 'translateX(calc(100vw + 150px))' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(-25%)' },
          '50%': { transform: 'translateX(0%)' },
        },
        'wave-reverse': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-25%)' },
        },
        'windmill-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        firefly: {
          '0%, 100%': { opacity: '0', transform: 'translate(0, 0)' },
          '25%': { opacity: '1' },
          '50%': { opacity: '1', transform: 'translate(10px, -15px)' },
          '75%': { opacity: '0.5' },
        },
        tumbleweed: {
          '0%': { transform: 'translateX(-30px) rotate(0deg)', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { transform: 'translateX(calc(100vw + 30px)) rotate(720deg)', opacity: '0' },
        },
        'bird-fly': {
          '0%': { transform: 'translateX(-20px)' },
          '100%': { transform: 'translateX(calc(100vw + 20px))' },
        },
        'bird-flap': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.6)' },
        },
      },
      animation: {
        twinkle: 'twinkle 3s ease-in-out infinite',
        'cloud-float': 'cloud-float 50s linear infinite',
        wave: 'wave 8s ease-in-out infinite',
        'wave-reverse': 'wave-reverse 6s ease-in-out infinite',
        'windmill-spin': 'windmill-spin 8s linear infinite',
        firefly: 'firefly 4s ease-in-out infinite',
        tumbleweed: 'tumbleweed 30s linear infinite',
        'bird-fly': 'bird-fly 30s linear infinite',
        'bird-flap': 'bird-flap 0.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
