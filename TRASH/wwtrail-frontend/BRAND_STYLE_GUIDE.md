# WW Trail Running - Guía de Estilo de Marca

## 🎨 Paleta de Colores

### Colores de Marca (Tailwind)
Usa estos colores con `brand-*` en tus componentes:

```jsx
// Acento principal (oro/tierra) - Para CTAs, enlaces activos
<button className="bg-brand-primary text-white">
  Inscríbete Ahora
</button>

// Negro puro - Texto principal
<h1 className="text-brand-dark">Título Principal</h1>

// Gris profundo - Texto secundario (mejor legibilidad)
<p className="text-brand-gray-deep">Párrafo de contenido largo...</p>

// Gris claro - Fondos auxiliares
<div className="bg-brand-gray-light">Sección</div>

// Estados
<div className="text-brand-success">✓ Completado</div>
<div className="text-brand-danger">✗ Error</div>
```

### Colores shadcn/ui (Sistema)
Para componentes de shadcn/ui, usa las clases habituales que ahora apuntan a tu paleta:

```jsx
<Button variant="default">     // Fondo oro/tierra (#B5751A)
<Button variant="secondary">   // Fondo gris claro
<Button variant="destructive"> // Fondo rojo error
```

## 🔤 Tipografía - Montserrat

Ya está configurada globalmente. No necesitas importarla.

### Jerarquía de Títulos
```jsx
<h1>Título Principal</h1>        // Bold (700), text-4xl
<h2>Sección</h2>                  // SemiBold (600), text-3xl
<h3>Subtítulo</h3>                // Medium (500), text-2xl
<p>Contenido</p>                  // Regular (400), color #333333
```

### Clases de Peso Disponibles
```jsx
font-normal    // 400 - Regular
font-medium    // 500 - Medium
font-semibold  // 600 - SemiBold
font-bold      // 700 - Bold
```

## 📐 Geometría

### Ángulos Rectos
**Border radius = 0px por defecto** (ya configurado globalmente)

```jsx
// Todos estos tienen ángulos rectos automáticamente
<Button />
<Input />
<Card />
<div className="rounded-lg" /> // También = 0px
```

### Sombras Sutiles
```jsx
<div className="shadow-sm">  // Sombra muy sutil
<div className="shadow">     // Sombra sutil default
```

## 🎯 Componentes Principales

### Botón Primario (CTA)
```jsx
<button className="bg-brand-primary text-white px-6 py-3 hover:opacity-90">
  Acción Principal
</button>
```

### Botón Secundario (Outline)
```jsx
<button className="border-2 border-brand-dark text-brand-dark px-6 py-3 hover:bg-brand-gray-light">
  Acción Secundaria
</button>
```

### Input con Focus
```jsx
<input
  className="border border-input px-4 py-2 focus:ring-2 focus:ring-brand-primary"
  placeholder="Email..."
/>
```

## 📊 Colores HEX de Referencia

| Nombre | HEX | Uso |
|--------|-----|-----|
| Acento Oro/Tierra | `#B5751A` | Botones, enlaces, elementos destacados |
| Negro Puro | `#000000` | Texto principal, iconos |
| Blanco Puro | `#FFFFFF` | Fondos, texto invertido |
| Gris Profundo | `#333333` | Texto secundario, párrafos largos |
| Gris Claro | `#F5F5F5` | Fondos auxiliares, hover |
| Verde Éxito | `#28A745` | Mensajes de éxito, confirmaciones |
| Rojo Error | `#DC3545` | Mensajes de error, alertas |

## ✅ Ejemplos Completos

### Card de Evento
```jsx
<div className="bg-white shadow-sm p-6">
  <h2 className="text-brand-dark">UTMB Mont Blanc</h2>
  <p className="text-brand-gray-deep mt-2">
    Descripción del evento...
  </p>
  <button className="mt-4 bg-brand-primary text-white px-6 py-3">
    Ver Detalles
  </button>
</div>
```

### Formulario
```jsx
<form className="bg-white shadow p-8">
  <h2 className="text-brand-dark mb-4">Registro</h2>

  <input
    className="w-full border border-input px-4 py-3 mb-4"
    placeholder="Nombre completo"
  />

  <button className="w-full bg-brand-primary text-white py-3">
    Inscribirse
  </button>
</form>
```

## 🚀 Migración de Código Existente

Si encuentras colores antiguos (verde, azul), reemplázalos:

```jsx
// ❌ Antiguo
bg-green-600  →  bg-brand-primary
bg-blue-600   →  bg-brand-primary
text-green-600 → text-brand-primary

// ❌ Antiguo
rounded-lg    →  (ya está en 0px, no cambiar nada)
rounded-md    →  (ya está en 0px, no cambiar nada)
```

---

**Nota:** Los cambios son automáticos. Los componentes de shadcn/ui (`Button`, `Input`, `Card`, etc.) ya usan la nueva paleta sin necesidad de modificarlos.
