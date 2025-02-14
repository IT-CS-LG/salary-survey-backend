import express from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

// @ts-ignore
router.post('/', createProfile);
// @ts-ignore
router.get('/:id', getProfile);
// @ts-ignore
router.put('/:id', updateProfile);

export default router; 