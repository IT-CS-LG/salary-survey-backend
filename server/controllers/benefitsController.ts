import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const BenefitsSchema = z.object({
  profileId: z.string(),
  annualBoxesPacked: z.string().nullable(),
  region: z.string().nullable(),
  colaAdjustments: z.boolean(),
  lastIncreasePercentage: z.string().nullable(),
  lastAdjustmentDate: z.string().nullable(),
  nextAdjustmentDate: z.string().nullable(),
  nextIncreasePercentage: z.string().nullable(),
  healthInsurance: z.boolean(),
  dentalInsurance: z.boolean(),
  visionInsurance: z.boolean(),
  lifeInsurance: z.boolean(),
  accidentalDeathInsurance: z.boolean(),
  deferredCompensation: z.boolean(),
  retirement401k: z.boolean(),
  employeeHealthPremiumPercentage: z.string(),
  dependentHealthPremiumPercentage: z.string(),
  firstYearPTO: z.string(),
  twoToFivePTO: z.string(),
  sixPlusPTO: z.string(),
  paidHolidays: z.string(),
  retirementPlan: z.boolean(),
  employerMatchPercentage: z.string().nullable(),
  employeeContributionPercentage: z.string().nullable(),
  hasAdditionalTier: z.boolean(),
  secondTierEmployerMatch: z.string().nullable(),
  secondTierEmployeeContribution: z.string().nullable()
});

export async function createBenefits(req: Request, res: Response) {
  try {
    console.log('Received benefits data:', req.body);
    const validatedData = BenefitsSchema.parse(req.body);
    
    // Check if benefits already exist for this profile
    const existingBenefits = await prisma.benefits.findUnique({
      where: { profileId: validatedData.profileId }
    });

    if (existingBenefits) {
      // If exists, update instead of create
      const benefits = await prisma.benefits.update({
        where: { profileId: validatedData.profileId },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        }
      });
      return res.json(benefits);
    }

    // If doesn't exist, create new
    const benefits = await prisma.benefits.create({
      data: {
        profileId: validatedData.profileId,
        annualBoxesPacked: validatedData.annualBoxesPacked,
        region: validatedData.region,
        colaAdjustments: validatedData.colaAdjustments,
        lastIncreasePercentage: validatedData.lastIncreasePercentage,
        lastAdjustmentDate: validatedData.lastAdjustmentDate,
        nextAdjustmentDate: validatedData.nextAdjustmentDate,
        nextIncreasePercentage: validatedData.nextIncreasePercentage,
        healthInsurance: validatedData.healthInsurance,
        dentalInsurance: validatedData.dentalInsurance,
        visionInsurance: validatedData.visionInsurance,
        lifeInsurance: validatedData.lifeInsurance,
        accidentalDeathInsurance: validatedData.accidentalDeathInsurance,
        deferredCompensation: validatedData.deferredCompensation,
        retirement401k: validatedData.retirement401k,
        employeeHealthPremiumPercentage: validatedData.employeeHealthPremiumPercentage,
        dependentHealthPremiumPercentage: validatedData.dependentHealthPremiumPercentage,
        firstYearPTO: validatedData.firstYearPTO,
        twoToFivePTO: validatedData.twoToFivePTO,
        sixPlusPTO: validatedData.sixPlusPTO,
        paidHolidays: validatedData.paidHolidays,
        retirementPlan: validatedData.retirementPlan,
        employerMatchPercentage: validatedData.employerMatchPercentage,
        employeeContributionPercentage: validatedData.employeeContributionPercentage,
        hasAdditionalTier: validatedData.hasAdditionalTier,
        secondTierEmployerMatch: validatedData.secondTierEmployerMatch,
        secondTierEmployeeContribution: validatedData.secondTierEmployeeContribution,
        id: crypto.randomUUID(),
        updatedAt: new Date()
      }
    });
    
    res.json(benefits);
  } catch (error) {
    console.error('Benefits validation/creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }
    if (error instanceof Error) {
      return res.status(400).json({ 
        error: 'Database error',
        message: error.message 
      });
    }
    res.status(400).json({ 
      error: 'Failed to create benefits',
    });
  }
}

export async function getBenefits(req: Request, res: Response) {
  try {
    const benefits = await prisma.benefits.findUnique({
      where: { profileId: req.params.profileId }
    });

    if (benefits) {
      // Restructure the data to match frontend expectations
      const formattedBenefits = {
        ...benefits,
        benefits: {
          healthInsurance: benefits.healthInsurance,
          dentalInsurance: benefits.dentalInsurance,
          visionInsurance: benefits.visionInsurance,
          lifeInsurance: benefits.lifeInsurance,
          accidentalDeathInsurance: benefits.accidentalDeathInsurance,
          deferredCompensation: benefits.deferredCompensation,
          retirement401k: benefits.retirement401k,
        }
      };
      res.json(formattedBenefits);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to get benefits' });
  }
}

export async function updateBenefits(req: Request, res: Response) {
  try {
    const benefits = await prisma.benefits.update({
      where: { profileId: req.params.profileId },
      data: req.body
    });
    res.json(benefits);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update benefits' });
  }
} 