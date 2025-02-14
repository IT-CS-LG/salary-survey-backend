import { Router } from 'express';
import rolesRouter from './roles';

const router = Router();

router.use('/roles', rolesRouter);
// ... other routes

export default router; 