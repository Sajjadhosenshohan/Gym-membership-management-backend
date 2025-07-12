import status from 'http-status';
import prisma from '../../shared/prisma';
import AppError from '../../error/AppError';

export const createClassBooking = async (
  classScheduleId: string,
  traineeId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    // Get class schedule with current bookifngs
    const classSchedule = await tx.classSchedule.findUnique({
      where: { id: classScheduleId },
      include: {
        bookings: {
          select: { id: true, traineeId: true },
        },
      },
    });

    if (!classSchedule) {
      throw new AppError(status.NOT_FOUND, 'Class not found');
    }

    // Check if class is full or not
    if (classSchedule.bookings.length >= 10) {
      throw new AppError(status.BAD_REQUEST, 'Class schedule is full');
    }

    // Check if this trainee already has a class at same start time
    const existingBooking = await tx.booking.findFirst({
      where: {
        traineeId,
        classSchedule: {
          startTime: classSchedule.startTime,
        },
      },
    });

    if (existingBooking) {
      throw new AppError(
        status.CONFLICT,
        'Already booked a class at this time',
      );
    }

    // Create booking
    const newBooking = await tx.booking.create({
      data: {
        traineeId,
        classScheduleId,
      },
    });

    return newBooking;
  });
};

const cancelBookingService = async (bookingId: string, traineeId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) {
    throw new AppError(status.NOT_FOUND, 'Booking not found');
  }

  if (booking.traineeId !== traineeId) {
    throw new AppError(
      status.UNAUTHORIZED,
      'Unauthorized to cancel this booking',
    );
  }

  return await prisma.booking.delete({
    where: { id: bookingId },
  });
};

const getMyBookings = async (traineeId: string) => {
  return await prisma.booking.findMany({
    where: { traineeId },
    include: { classSchedule: true },
  });
};

export const ClassBookingService = {
  createClassBooking,
  cancelBookingService,
  getMyBookings
};
