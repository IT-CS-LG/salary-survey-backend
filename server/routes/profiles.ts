import express from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

router.post('/', createProfile);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);

export default router; 