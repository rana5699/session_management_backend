import dayjs from 'dayjs';
import prisma from './PrismaClient';

export async function professionalUserKey(deptCode: string): Promise<string> {
  const today = dayjs().startOf('day').toDate();
  const dateStr = dayjs(today).format('YYYYMMDD');

  const result = await prisma.$transaction(async (tx) => {
    let counter = await tx.counter.findFirst({
      where: {
        type: 'PROFESSIONAL',
        department: deptCode,
        date: today,
      },
    });

    if (!counter) {
      counter = await tx.counter.create({
        data: {
          type: 'PROFESSIONAL',
          department: deptCode,
          date: today,
          lastSerial: 1,
        },
      });
    } else {
      counter = await tx.counter.update({
        where: { id: counter.id },
        data: { lastSerial: counter.lastSerial + 1 },
      });
    }

    const serial = counter.lastSerial.toString().padStart(5, '0');
    return `${deptCode}-${dateStr}-${serial}`;
  });

  return result || '';
}

export async function patientUserKey(): Promise<string> {
  const today = dayjs().startOf('day').toDate();
  const dateStr = dayjs(today).format('YYYYMMDD');

  const result = await prisma.$transaction(async (tx) => {
    let counter = await tx.counter.findFirst({
      where: {
        type: 'PATIENT',
        date: today,
      },
    });

    if (!counter) {
      counter = await tx.counter.create({
        data: {
          type: 'PATIENT',
          date: today,
          lastSerial: 1,
        },
      });
    } else {
      counter = await tx.counter.update({
        where: { id: counter.id },
        data: { lastSerial: counter.lastSerial + 1 },
      });
    }

    const serial = counter.lastSerial.toString().padStart(5, '0');
    return `RS-${dateStr}-${serial}`;
  });

  return result;
}
