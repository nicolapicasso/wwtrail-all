# Configuración de OpenAI API para Traducciones Automáticas

## 🔍 Problema Identificado

La clave de OpenAI en tu `.env` estaba duplicada y el formato era inválido, causando errores 403/429.

## ✅ Pasos para Configurar OpenAI

### 1. Obtener una API Key válida

1. Ve a **https://platform.openai.com/api-keys**
2. Inicia sesión o crea una cuenta
3. Haz clic en **"Create new secret key"**
4. Copia la clave completa (formato: `sk-proj-...` o `sk-...`)
   - ⚠️ **IMPORTANTE**: Solo se muestra una vez, guárdala en lugar seguro

### 2. Verificar y Agregar Créditos

**Antes de usar la API, debes tener créditos en tu cuenta:**

1. Ve a **https://platform.openai.com/account/billing**
2. Verifica que tienes créditos disponibles
3. Si no tienes créditos:
   - Haz clic en **"Add payment method"**
   - Agrega una tarjeta de crédito
   - Compra créditos (mínimo $5 USD recomendado)

**Nota**: Las cuentas gratuitas de OpenAI tienen límites muy restrictivos y pueden no funcionar para producción.

### 3. Configurar la API Key en el Proyecto

1. Abre el archivo `.env` en `wwtrail-backend/`
2. Reemplaza `your-openai-api-key-here` con tu clave real:

```bash
OPENAI_API_KEY=sk-proj-TU_CLAVE_AQUI_xxxxxxxxxxxxxxxxxxx
```

3. Guarda el archivo

### 4. Verificar la Configuración

Ejecuta el script de prueba:

```bash
cd wwtrail-backend
node scripts/test-openai.js
```

**Resultado esperado (✅ éxito):**
```
✅ API Key encontrada: sk-proj-xxx...xxx
📡 Haciendo petición de prueba a OpenAI...
✅ ¡API Key funciona correctamente!

Respuesta de OpenAI:
Hello world

Modelo usado: gpt-4o-mini
Tokens usados: X
```

**Errores comunes:**

- **Error 401**: La API key es inválida o fue revocada
  - Solución: Crea una nueva API key

- **Error 429**: Sin créditos o límite de rate excedido
  - Solución: Agrega créditos en https://platform.openai.com/account/billing

- **Error 403**: Problema de red/proxy o clave mal formateada
  - Solución: Verifica que copiaste la clave completa sin espacios

### 5. Reiniciar el Backend

Después de configurar la clave:

```bash
cd wwtrail-backend
npm run dev
```

### 6. Probar las Traducciones

1. Ve al frontend: http://localhost:3000
2. Crea un nuevo evento/competición en cualquier idioma (ES, EN, IT, etc.)
3. Verifica los logs del backend - deberías ver:
   ```
   Triggering auto-translation for event "..." from ES to: EN, IT, CA, FR, DE
   Auto-translation completed for event ...: 5 translations created
   ```
4. Verifica las traducciones en la base de datos:
   ```bash
   node scripts/check-translations.js
   ```

## 💰 Costos Estimados

Usando el modelo **gpt-4o-mini** (el más económico):

- **Input**: $0.150 por 1M tokens
- **Output**: $0.600 por 1M tokens

**Ejemplo**: Traducir un evento típico (500 palabras) a 5 idiomas:
- Costo aproximado: **$0.01 - $0.03 USD** por evento
- Con $5 USD puedes traducir ~200-500 eventos

## 🔧 Troubleshooting

### Las traducciones no se crean

1. Verifica que `AUTO_TRANSLATE_ENABLED=true` en `.env`
2. Revisa los logs del backend cuando creas contenido
3. Ejecuta `node scripts/check-translations.js` para ver el estado

### Verificar uso de la API

- Ve a **https://platform.openai.com/usage** para ver tu consumo en tiempo real
- Puedes configurar alertas de uso para evitar sorpresas

## 📝 Notas Importantes

- **Seguridad**: NUNCA subas el `.env` con tu API key a GitHub
- El `.env` está en `.gitignore` por seguridad
- Cada desarrollador debe tener su propia API key
- Las traducciones se guardan en la base de datos (no se recalculan cada vez)
- El modo BACKGROUND está habilitado para no bloquear las peticiones

## ✅ Checklist

- [ ] Creé una cuenta en OpenAI Platform
- [ ] Generé una API key nueva
- [ ] Agregué créditos a mi cuenta ($5+ recomendado)
- [ ] Configuré la API key en el `.env`
- [ ] Ejecuté `node scripts/test-openai.js` exitosamente
- [ ] Reinicié el backend con `npm run dev`
- [ ] Probé crear un evento y las traducciones se generaron
- [ ] Verifiqué las traducciones con `node scripts/check-translations.js`
