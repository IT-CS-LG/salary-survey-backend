import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


const prisma = new PrismaClient();

const RoleResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  payType: z.string(),
  sortOrder: z.number(),
  isOwner: z.boolean(),
  salary: z.string(),
  hourlyWage: z.string(),
  bonus: z.string(),
  yearsInPosition: z.string(),
  companyCar: z.boolean(),
  remote: z.boolean(),
  retirement: z.boolean(),
  deferredComp: z.boolean(),
  hasMultipleEmployees: z.boolean(),
  hasCompensationDifference: z.boolean(),
  numberOfEmployees: z.string(),
  combinesResponsibilities: z.boolean(),
  combinedRoles: z.string().nullable(),
  updatedAt: z.date().optional()
});

const RolesRequestSchema = z.object({
  profileId: z.string(),
  roles: z.array(RoleResponseSchema)
});

export async function createRoles(req: Request, res: Response) {
  try {
    console.log('Received roles data:', JSON.stringify(req.body, null, 2));
    const { profileId, roles } = RolesRequestSchema.parse(req.body);

    // Delete existing roles for this profile
    await prisma.roleResponse.deleteMany({
      where: { profileId },
    });

    // Create role responses
    const createdRoles = await Promise.all(
      roles.map(async (role) => {
        console.log('Creating role:', JSON.stringify(role, null, 2));
        const roleData = {
          id: crypto.randomUUID(),
          profileId,
          title: role.title,
          type: role.type,
          payType: role.payType,
          sortOrder: role.sortOrder,
          isOwner: role.isOwner,
          salary: role.salary,
          hourlyWage: role.hourlyWage,
          bonus: role.bonus,
          yearsInPosition: role.yearsInPosition,
          companyCar: role.companyCar,
          remote: role.remote,
          retirement: role.retirement,
          deferredComp: role.deferredComp,
          hasMultipleEmployees: role.hasMultipleEmployees,
          hasCompensationDifference: role.hasCompensationDifference,
          numberOfEmployees: role.numberOfEmployees,
          combinesResponsibilities: role.combinesResponsibilities,
          combinedRoles: role.combinedRoles,
          updatedAt: new Date()
        };

        console.log('Role data to save:', JSON.stringify(roleData, null, 2));
        return prisma.roleResponse.create({
          data: roleData
        });
      })
    );

    console.log('Created roles:', JSON.stringify(createdRoles, null, 2));
    res.json(createdRoles);
  } catch (error) {
    console.error('Roles validation/creation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    res.status(400).json({ error: 'Failed to create roles' });
  }
}

export async function getRoles(req: Request, res: Response) {
  try {
    const roleResponses = await prisma.roleResponse.findMany({
      where: { profileId: req.params.profileId },
    });

    const formattedRoles = roleResponses.map(role => ({
      id: role.id,
      title: role.title,
      type: role.type,
      payType: role.payType,
      responses: {
        isOwner: role.isOwner,
        salary: role.salary,
        hourlyWage: role.hourlyWage,
        bonus: role.bonus,
        yearsInPosition: role.yearsInPosition,
        companyCar: role.companyCar,
        remote: role.remote,
        retirement: role.retirement,
        deferredComp: role.deferredComp,
        hasMultipleEmployees: role.hasMultipleEmployees,
        hasCompensationDifference: role.hasCompensationDifference,
        numberOfEmployees: role.numberOfEmployees,
        combinesResponsibilities: role.combinesResponsibilities,
        combinedRoles: role.combinedRoles ? JSON.parse(role.combinedRoles) : [],
      }
    }));

    res.json(formattedRoles);
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(400).json({ error: 'Failed to get roles' });
  }
}

export async function createRoleResponse(req: Request, res: Response) {
  try {
    const roleResponse = await prisma.roleResponse.create({
      data: req.body
    });
    res.json(roleResponse);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create role response' });
  }
} 