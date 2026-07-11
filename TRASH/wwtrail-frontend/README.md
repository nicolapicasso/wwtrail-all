# 🏃‍♂️ WWTRAIL Frontend - FASE 3 COMPLETADA

Plataforma web para descubrir y participar en competiciones de trail running alrededor del mundo.

## 📋 Estado del Proyecto

### ✅ FASE 1 - Setup Inicial
- Next.js 14 con App Router
- TypeScript configurado
- TailwindCSS + Variables CSS personalizadas
- Estructura de carpetas

### ✅ FASE 2 - API Client y Tipos
- Axios configurado con interceptores
- Tipos TypeScript completos
- Servicios de API (auth, competitions)
- Manejo de JWT tokens con cookies
- Refresh token automático

### ✅ FASE 3 - Sistema de Autenticación UI
- **Shadcn/ui** componentes instalados (Button, Input, Label, Card)
- **Login page** con validación completa
- **Register page** con React Hook Form + Zod
- **Auth Context Provider** para gestión de estado global
- **Protected routes** con middleware de Next.js
- **Navbar** con estado de usuario y menú responsive
- **Dashboard page** con información del usuario

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS
- **Componentes UI**: Shadcn/ui
- **Validación**: Zod + React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Autenticación**: JWT (cookies)
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
wwtrail-frontend/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   └── register/
│   │       └── page.tsx          # Página de registro
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard de usuario
│   ├── layout.tsx                # Layout principal con AuthProvider
│   ├── page.tsx                  # Página de inicio
│   └── globals.css               # Estilos globales
├── components/
│   ├── ui/                       # Componentes de Shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   └── Navbar.tsx                # Navbar con estado de auth
├── contexts/
│   └── AuthContext.tsx           # Context de autenticación
├── lib/
│   ├── api/
│   │   ├── client.ts             # Cliente Axios con interceptores
│   │   ├── auth.service.ts       # Servicio de autenticación
│   │   ├── competitions.service.ts
│   │   └── index.ts
│   ├── validations/
│   │   └── auth.ts               # Schemas de Zod
│   ├── types.ts                  # Tipos TypeScript
│   └── utils.ts                  # Utilidades (cn)
├── middleware.ts                 # Middleware para rutas protegidas
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/nicolapicasso/wwtrail-frontend.git
cd wwtrail-frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Login/Register**: El usuario se autentica en `/auth/login` o `/auth/register`
2. **JWT Tokens**: Se reciben `accessToken` y `refreshToken`
3. **Cookies**: Los tokens se almacenan en cookies seguras
4. **Auth Context**: El estado de autenticación se gestiona globalmente
5. **Protected Routes**: El middleware redirige usuarios no autenticados
6. **Auto Refresh**: Los tokens se refrescan automáticamente al expirar

### Cookies de Sesión

```typescript
// accessToken: expira en 1 día
// refreshToken: expira en 7 días
// Configuración: httpOnly, secure (producción), sameSite: strict
```

### Rutas Protegidas

El middleware protege automáticamente todas las rutas excepto:
- `/` (home)
- `/auth/login`
- `/auth/register`
- `/test-api`

## 📝 Schemas de Validación

### Login Schema
```typescript
{
  email: string (email válido)
  password: string (mínimo 6 caracteres)
}
```

### Register Schema
```typescript
{
  email: string (email válido)
  username: string (3-20 caracteres, solo alfanuméricos y _)
  password: string (6-50 caracteres)
  confirmPassword: string (debe coincidir con password)
  firstName?: string (opcional)
  lastName?: string (opcional)
}
```

## 🎨 Componentes UI

### Button
```tsx
<Button variant="default | destructive | outline | secondary | ghost | link">
  Texto
</Button>
```

### Input
```tsx
<Input type="text" placeholder="..." />
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## 🔌 API Services

### Auth Service
```typescript
authService.login({ email, password })
authService.register({ email, username, password })
authService.logout()
authService.getCurrentUser()
authService.isAuthenticated()
```

### Competitions Service
```typescript
competitionsService.getAll(filters)
competitionsService.getById(id)
competitionsService.create(data)
competitionsService.update(id, data)
competitionsService.delete(id)
```

## 🎯 Próximos Pasos (FASE 4)

- [ ] Página de listado de competiciones
- [ ] Sistema de filtros y búsqueda
- [ ] Página de detalle de competición
- [ ] Sistema de inscripciones
- [ ] Perfil de usuario editable
- [ ] Panel de organizador

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 📦 Dependencias Principales

```json
{
  "next": "14.2.5",
  "react": "^18.2.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "axios": "^1.6.7",
  "react-hook-form": "^7.50.1",
  "zod": "^3.22.4",
  "js-cookie": "^3.0.5",
  "lucide-react": "^0.344.0"
}
```

## 🌐 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 🎨 Tema de Colores

```css
/* Primary (Verde Trail) */
--primary: 142 76% 36%

/* Variables de Tailwind */
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--secondary, --muted, --accent
--destructive, --border, --input, --ring
```

## 📱 Responsive Design

La aplicación es completamente responsive con breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Seguridad

- JWT tokens en cookies HTTP-only
- CSRF protection con SameSite cookies
- Validación de formularios con Zod
- Protected routes con middleware
- Auto-logout en caso de token inválido

## 👥 Autor

Nicolás Picasso - [GitHub](https://github.com/nicolapicasso)

## 📄 Licencia

Este proyecto es privado.

---

**¡FASE 3 COMPLETADA! 🎉**

Sistema de autenticación completo con UI profesional, validación de formularios, gestión de estado global y protección de rutas.
