import { Router } from 'express';
import { createRoles, getRoles } from '../controllers/rolesController';

const router = Router();

// @ts-ignore
router.post('/', createRoles);
// @ts-ignore
router.get('/:profileId', getRoles);

export default router; 