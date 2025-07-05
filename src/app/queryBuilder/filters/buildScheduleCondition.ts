import { Prisma, ScheduleAvailabilityType } from '@prisma/client';

export interface IScheduleFilter {
  type?: ScheduleAvailabilityType;
  dayOfWeek?: number;
  specificDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  dayOfMonth?: number;
  startTime?: string;
  endTime?: string;
  isAvailable?: boolean;
}

export function buildScheduleCondition(scheduleFilter?: IScheduleFilter): Prisma.UserProfileWhereInput | undefined {
  if (!scheduleFilter) return undefined;

  return {
    professional: {
      scheduleAvailability: {
        some: {
          ...(scheduleFilter.type && { type: scheduleFilter.type }),
          ...(scheduleFilter.dayOfWeek !== undefined && { dayOfWeek: scheduleFilter.dayOfWeek }),
          ...(scheduleFilter.specificDate && { specificDate: scheduleFilter.specificDate }),
          ...(scheduleFilter.fromDate && { fromDate: { gte: scheduleFilter.fromDate } }),
          ...(scheduleFilter.toDate && { toDate: { lte: scheduleFilter.toDate } }),
          ...(scheduleFilter.dayOfMonth && { dayOfMonth: scheduleFilter.dayOfMonth }),
          ...(scheduleFilter.startTime && { startTime: scheduleFilter.startTime }),
          ...(scheduleFilter.endTime && { endTime: scheduleFilter.endTime }),
          ...(scheduleFilter.isAvailable !== undefined && { isAvailable: scheduleFilter.isAvailable }),
        },
      },
    },
  };
}
