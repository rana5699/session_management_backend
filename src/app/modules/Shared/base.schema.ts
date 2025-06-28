import { BloodGroup, Gender, LanguagePreference, ScheduleAvailabilityType, UserRole } from '@prisma/client';
import { nativeEnum, z } from 'zod';

export const baseUserSchema = z.object({
  userKey: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Invalid user role.' }),
  }).default("PATIENT"),
});

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),

  gender: nativeEnum(Gender, {
    errorMap: () => ({ message: 'Invalid gender.' }),
  }),

 dateOfBirth: z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),


  emergencyContact: z
    .string()
    .min(11, 'Emergency contact must be at least 11 digits')
    .optional()
    .nullable(),

  relationWithEC: z.string().optional().nullable(),

  presentAddress: z.string().optional().nullable(),
  permanentAddress: z.string().optional().nullable(),

  profilePicture: z.string().url('Invalid profile picture URL').optional().nullable(),

  bloodGroup: z
    .nativeEnum(BloodGroup, {
      errorMap: () => ({ message: 'Invalid blood group.' }),
    }).default("UNKNOWN")
    .optional()
    .nullable(),
});

export const professionalProfileSchema = z.object({
  departmentId: z.string().uuid('Invalid department ID'),
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  experienceYears: z.number().min(0, 'Experience must be zero or more'),
  languagesSpoken: z.nativeEnum(LanguagePreference, {
    errorMap: () => ({ message: 'Invalid language preference.' }),
  }).default("BANGLA"),

  enteredId: z.string().uuid('Invalid entered ID').optional().nullable(),
});

export const scheduleAvailabilitySchema = z.object({
  type: z.nativeEnum(
    ScheduleAvailabilityType ,{
      errorMap: () => ({ message: 'Invalid schedule availability type.' }),
    }
  ).default("MONTHLY"),
  dayOfWeek: z.number().min(0).max(6).optional(),
  specificDate: z.string().datetime().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  isAvailable: z.boolean().default(true),
});

