import rateLimit from 'express-rate-limit';

// Rate limiter MUY permisivo para desarrollo
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto (en vez de 15)
  max: 1000, // 1000 requests (en vez de 100)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para auth también más permisivo
export const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 intentos (en vez de 5)
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});