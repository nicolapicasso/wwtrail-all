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
        // shadcn/ui system colors (mantener para compatibilidad)
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

        // WW Trail Running Brand Colors (Guía de Estilo)
        'brand': {
          'primary': '#B5751A',      // Acento oro/tierra (CTA, enlaces)
          'neutral': '#FFFFFF',       // Blanco puro (fondos)
          'dark': '#000000',          // Negro puro (texto principal)
          'gray-deep': '#333333',     // Gris profundo (texto secundario)
          'gray-light': '#F5F5F5',    // Gris claro (fondos auxiliares)
          'success': '#28A745',       // Verde oscuro (éxito)
          'danger': '#DC3545',        // Rojo oscuro (error/alerta)
        },

        // Color hover naranja
        hover: "#B66916",
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],  // Tipografía principal
      },
      borderRadius: {
        lg: "0px",      // Ángulos rectos por defecto
        md: "0px",
        sm: "0px",
        DEFAULT: "0px",
        none: "0px",
      },
      boxShadow: {
        // Sombras sutiles siguiendo la guía
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        // Footer landscape animations
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
