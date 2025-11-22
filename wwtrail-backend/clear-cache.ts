// Script temporal para limpiar cache de Redis
import { cache } from './src/config/redis';

async function clearPromotionsCache() {
  try {
    console.log('🧹 Limpiando cache de promociones...');
    await cache.delPattern('promotions:*');
    console.log('✅ Cache de promociones limpiado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearPromotionsCache();
