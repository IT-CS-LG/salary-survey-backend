import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Add zod for validation

const prisma = new PrismaClient();

// Validation schema
const ProfileSchema = z.object({
  companyName: z.string().min(1),
  contactFirstName: z.string().min(1),
  contactLastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  roleDepartment: z.string().min(1),
  organizationType: z.string().min(1),
});

export async function createProfile(req: Request, res: Response) {
  try {
    console.log('Received profile data:', req.body);
    const validatedData = ProfileSchema.parse(req.body);
    
    // Check if profile already exists with exact match on all fields
    const existingProfile = await prisma.profile.findFirst({
      where: { 
        AND: [
          { email: validatedData.email },
          { companyName: validatedData.companyName },
          { contactFirstName: validatedData.contactFirstName },
          { contactLastName: validatedData.contactLastName },
          { phone: validatedData.phone },
          { roleDepartment: validatedData.roleDepartment },
          { organizationType: validatedData.organizationType }
        ]
      }
    });

    if (existingProfile) {
      // If exists, update instead of create
      const profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        }
      });
      return res.json(profile);
    }

    // If doesn't exist, create new
    const profile = await prisma.profile.create({
      data: {
        companyName: validatedData.companyName,
        contactFirstName: validatedData.contactFirstName,
        contactLastName: validatedData.contactLastName,
        email: validatedData.email,
        phone: validatedData.phone,
        roleDepartment: validatedData.roleDepartment,
        organizationType: validatedData.organizationType,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    
    res.json(profile);
  } catch (error) {
    console.error('Profile creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    res.status(400).json({ error: 'Failed to create profile' });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.params.id }
    });
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = ProfileSchema.partial().parse(req.body);

    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data: validatedData,
    });
    
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      res.status(400).json({ error: 'Failed to update profile' });
    }
  }
} 