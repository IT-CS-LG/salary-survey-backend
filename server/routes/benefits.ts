import { Router } from 'express';
import { createBenefits, getBenefits, updateBenefits } from '../controllers/benefitsController.js';

const router = Router();

router.post('/', createBenefits);
router.get('/:profileId', getBenefits);
router.put('/:profileId', updateBenefits);

export default router; 