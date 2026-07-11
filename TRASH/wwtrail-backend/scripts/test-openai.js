// Script para probar la API Key de OpenAI
// Ejecutar con: node scripts/test-openai.js

require('dotenv').config();
const axios = require('axios');

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  console.log('\n🔍 Verificando API Key de OpenAI...\n');

  if (!apiKey) {
    console.log('❌ ERROR: OPENAI_API_KEY no está configurada en el .env');
    return;
  }

  console.log(`✅ API Key encontrada: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log('\n📡 Haciendo petición de prueba a OpenAI...\n');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Traduce al inglés: "Hola mundo"'
          }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ ¡API Key funciona correctamente!');
    console.log('\nRespuesta de OpenAI:');
    console.log(response.data.choices[0].message.content);
    console.log('\nModelo usado:', response.data.model);
    console.log('Tokens usados:', response.data.usage.total_tokens);

  } catch (error) {
    console.log('❌ ERROR al llamar a la API de OpenAI:\n');

    if (error.response) {
      console.log('Status Code:', error.response.status);
      console.log('Error:', error.response.data);

      if (error.response.status === 429) {
        console.log('\n⚠️  ERROR 429: Too Many Requests');
        console.log('Posibles causas:');
        console.log('  1. Has excedido el límite de rate de tu plan');
        console.log('  2. No tienes créditos en tu cuenta de OpenAI');
        console.log('  3. Tu API key pertenece a un tier gratuito que ha agotado su cuota');
        console.log('\nSolución:');
        console.log('  - Ve a https://platform.openai.com/usage para ver tu uso');
        console.log('  - Ve a https://platform.openai.com/account/billing para agregar créditos');
      } else if (error.response.status === 401) {
        console.log('\n⚠️  ERROR 401: Unauthorized');
        console.log('Tu API key es inválida o ha sido revocada');
        console.log('Solución:');
        console.log('  - Crea una nueva API key en https://platform.openai.com/api-keys');
        console.log('  - Actualiza el .env con la nueva key');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testOpenAI();
