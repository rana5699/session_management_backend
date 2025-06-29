import { z } from 'zod';
import {
  baseUserSchema,
  professionalProfileSchema,
  scheduleAvailabilitySchema,
  userProfileSchema,
} from '../Shared/base.schema';

export const createAdminSchema = z.object({
  user: baseUserSchema,
  userProfile: userProfileSchema,

  professionalProfile: professionalProfileSchema.extend({
    enteredId: z.string().uuid().optional().nullable(),
  }),

  scheduleAvailability: z.array(scheduleAvailabilitySchema).optional().default([]),
});
