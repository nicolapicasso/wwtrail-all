import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test route works!',
  });
});

export default router;