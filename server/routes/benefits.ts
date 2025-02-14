import express from 'express';
import { createBenefits, getBenefits, updateBenefits } from '../controllers/benefitsController';

const router = express.Router();

// @ts-ignore
router.post('/', createBenefits);
// @ts-ignore
router.get('/:profileId', getBenefits);
// @ts-ignore
router.put('/:profileId', updateBenefits);

export default router; 