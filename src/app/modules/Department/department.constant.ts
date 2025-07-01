import { ProfessionalProfile, ScheduleAvailability, User, UserProfile } from '@prisma/client';

export interface AdminUpdateData {
  user?: Partial<User>;
  userProfile?: Partial<UserProfile>;
  professionalProfile?: Partial<ProfessionalProfile>;
  profilePicture?: string;
  scheduleAvailability?: ScheduleAvailability[];
}

export interface CreateAdminInput {
  user: Pick<User, 'email' | 'phone' | 'password' | 'userKey'>;
  userProfile: Partial<UserProfile>;
  professionalProfile: Pick<
    ProfessionalProfile,
    'departmentId' | 'qualifications' | 'experienceYears' | 'languagesSpoken'
  >;
  scheduleAvailability?: Omit<ScheduleAvailability, 'id' | 'professionalId'>[];
  profilePicture?: string;
}
