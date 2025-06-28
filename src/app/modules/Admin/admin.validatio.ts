import { z } from 'zod';
import {
  baseUserSchema,
  professionalProfileSchema,
  scheduleAvailabilitySchema,
  userProfileSchema,
} from '../Shared/base.schema';

export const createAdminSchema = z.object({
  user: baseUserSchema.extend({
    role: z.literal('ADMIN', {
      errorMap: () => ({ message: 'Role must be ADMIN.' }),
    }),
  }),
  userProfile: userProfileSchema,

  professionalProfile: professionalProfileSchema.extend({
    enteredId: z.string().uuid().optional().nullable(),
  }),

  scheduleAvailability: z.array(scheduleAvailabilitySchema).optional().default([]),
});
