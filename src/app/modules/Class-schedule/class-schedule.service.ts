import status from 'http-status';
import prisma from '../../shared/prisma';
import { classScheduleValidation } from './class-schedule.validation';
import AppError from '../../error/AppError';
import { paginationHelper } from '../../helpers/paginationHelpers';
import { IPaginationOptions } from '../../interface/pagination';

const createScheduleService = async (payload: any) => {
  const { date, startTime, trainerId } = payload;

  const dateTimeString = `${date}T${startTime}:00`; // first get this type format ==>> YYYY-MM-DDTHH:MM

  const start = new Date(dateTimeString);

  if (isNaN(start.getTime())) {
    throw new AppError(400, 'Invalid date or time format');
  }

  const end = new Date(start);
  end.setHours(end.getHours() + 2);

  const scheduleDate = new Date(date);

  // Prisma Transaction
  const result = await prisma.$transaction(async (tx) => {
    // find the trainer
    const trainer = await tx.user.findUnique({
      where: {
        id: trainerId,
      },
    });

    if (!trainer) {
      throw new AppError(status.NOT_FOUND, 'Trainer not found');
    }

    // Check daily schedule limit
    const existingSchedules = await tx.classSchedule.findMany({
      where: { date: scheduleDate },
    });

    if (existingSchedules.length >= 5) {
      throw new AppError(
        status.BAD_REQUEST,
        'Daily schedule limit (5) reached',
      );
    }

    // Check overlapping classes for the trainer
    const overlap = await tx.classSchedule.findFirst({
      where: {
        trainerId,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (overlap) {
      throw new AppError(
        status.CONFLICT,
        'Trainer already has a class during this time.',
      );
    }

    // Create new schedule
    const newSchedule = await tx.classSchedule.create({
      data: {
        date: scheduleDate,
        startTime: start,
        endTime: end,
        trainerId,
      },
    });

    return newSchedule;
  });

  return result;
};

const getAvailableSchedulesService = async (options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.classSchedule.findMany({
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
          createdAt: true,
        },
      },
      _count: {
        select: { bookings: true },
      },
      bookings: true,
    },
    where: {
      bookings: {},
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const availableSchedules = result.filter(
    (schedule) => schedule._count.bookings < 10,
  );

  return {
    meta: {
      page,
      limit,
      total: availableSchedules.length,
    },
    data: availableSchedules,
  };
};


const getTrainerSchedulesService = async (
  userId: string,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const result = await prisma.classSchedule.findMany({
    where: {
      trainerId: userId,
    },
    include: {
      trainer: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      bookings: {
        include: {
          trainee: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
      _count: {
        select: { bookings: true },
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.classSchedule.count({
    where: { trainerId: userId },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ClassScheduleService = {
  createScheduleService,
  getAvailableSchedulesService,
  getTrainerSchedulesService
};
