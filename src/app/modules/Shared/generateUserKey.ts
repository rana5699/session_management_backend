import { CounterType } from '@prisma/client';
import dayjs from 'dayjs';
import prisma from '../../helper/PrismaClient';
import AppError from '../../helper/AppError';
import status from 'http-status';

export const generateUserKey = async ({
  userType,
  deptCode,
}: {
  userType: CounterType;
  deptCode?: string;
}): Promise<string> => {
  const today = dayjs().startOf('day').toDate();

  const result = await prisma.$transaction(async (tx) => {
    let counter = await tx.counter.findFirst({
      where: {
        type: userType,
      },
    });

    if (!counter) {
      counter = await tx.counter.create({
        data: {
          type: userType,
          date: today,
          lastSerial: 1,
        },
      });
    } else {
      counter = await tx.counter.update({
        where: { type: userType },
        data: {
          lastSerial: counter.lastSerial + 1,
        },
      });
    }

    const serialStr = String(counter.lastSerial).padStart(5, '0');

    const formattedDate = dayjs(today).format('YYYYMMDD');

    if (userType === CounterType.PROFESSIONAL) {
      if (!deptCode) {
        throw new AppError(
          status.BAD_REQUEST,
          'Department code is required for professional user key generation.'
        );
      }

      return `${deptCode}-${formattedDate}-${serialStr}`;
    }

    return `$SR-${formattedDate}-${serialStr}`;
  });


  return result;
};
