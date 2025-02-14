import { Router } from 'express';
import { createRoles, getRoles } from '../controllers/rolesController';

const router = Router();

router.post('/', createRoles);
router.get('/:profileId', getRoles);

export default router; 