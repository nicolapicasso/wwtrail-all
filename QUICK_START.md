# 🚀 Quick Start - Activar Traducciones Automáticas

## ✅ Lo que ya está hecho

El sistema de traducciones está **100% implementado y funcional**. Solo falta configurar la API key de OpenAI.

## 🔧 Lo que necesitas hacer AHORA

### Paso 1: Obtener API Key de OpenAI (5 minutos)

1. Ve a: **https://platform.openai.com/api-keys**
2. Inicia sesión o crea cuenta
3. Clic en **"Create new secret key"**
4. Copia la clave completa (empieza con `sk-proj-...` o `sk-...`)

### Paso 2: Agregar Créditos ($5 USD recomendado)

1. Ve a: **https://platform.openai.com/account/billing**
2. Agrega método de pago
3. Compra créditos mínimo $5 USD

**Nota**: Sin créditos las traducciones NO funcionarán (Error 429)

### Paso 3: Configurar en el Proyecto

1. Abre: `wwtrail-backend/.env`
2. Busca la línea: `OPENAI_API_KEY=your-openai-api-key-here`
3. Reemplaza con tu clave real:
   ```bash
   OPENAI_API_KEY=sk-proj-TU_CLAVE_REAL_AQUI
   ```
4. Guarda el archivo

### Paso 4: Probar la Configuración

```bash
# Terminal 1: Probar API key directamente
cd wwtrail-backend
node scripts/test-openai.js

# Si ves "✅ ¡API Key funciona correctamente!" continúa
# Si ves error, revisa los pasos 1-3

# Terminal 2: Reiniciar backend
npm run dev
```

### Paso 5: Verificar Traducciones

1. Abre el frontend: http://localhost:3000
2. Crea un nuevo evento en cualquier idioma (por ejemplo, Español)
3. Revisa los logs del backend - deberías ver:
   ```
   Triggering auto-translation for event "..." from ES to: EN, IT, CA, FR, DE
   Auto-translation completed: 5 translations created
   ```
4. Verifica en base de datos:
   ```bash
   cd wwtrail-backend
   node scripts/check-translations.js
   ```

## 💰 Costos

Con el modelo **gpt-4o-mini** (el más barato de OpenAI):
- **Por evento**: ~$0.01 - $0.03 USD
- **Con $5 USD**: ~200-500 eventos traducidos a 5 idiomas

## ❌ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| **401 Unauthorized** | API key inválida | Genera nueva clave en platform.openai.com |
| **429 Too Many Requests** | Sin créditos o límite excedido | Agrega créditos en billing |
| **403 Forbidden** | Clave mal formateada | Verifica que copiaste la clave completa |
| **No traducciones** | AUTO_TRANSLATE_ENABLED=false | Verifica .env (debe ser true) |

## 📚 Documentación Completa

- **OPENAI_SETUP.md**: Guía detallada con troubleshooting
- **SESSION_FIXES_SUMMARY.md**: Análisis técnico completo del sistema

## ✅ Checklist Rápido

- [ ] Obtuve API key de OpenAI
- [ ] Agregué créditos ($5+)
- [ ] Configuré la key en `.env`
- [ ] Ejecuté `node scripts/test-openai.js` → ✅
- [ ] Reinicié backend con `npm run dev`
- [ ] Creé un evento de prueba
- [ ] Las traducciones se generaron automáticamente

## 🆘 Si algo no funciona

1. Ejecuta: `node scripts/test-openai.js` para ver el error específico
2. Revisa: `OPENAI_SETUP.md` para troubleshooting detallado
3. Verifica logs del backend cuando creas contenido
4. Chequea uso de API en: https://platform.openai.com/usage

---

**¡Listo!** Una vez configurada la API key, el sistema funcionará automáticamente. Cada vez que crees contenido en cualquier idioma, se traducirá automáticamente a los otros 5 idiomas en background.
