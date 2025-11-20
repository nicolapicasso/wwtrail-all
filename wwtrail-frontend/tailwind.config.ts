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
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
