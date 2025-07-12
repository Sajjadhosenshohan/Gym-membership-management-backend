import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClassBookingService } from './class-booking.service';

const createClassBooking = catchAsync(async (req, res) => {
  const { classScheduleId, traineeId } = req.body;
  const result = await ClassBookingService.createClassBooking(
    classScheduleId,
    traineeId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Class booking created successfully',
    data: result,
  });
});
const cancelClassBooking = catchAsync(async (req, res) => {
  const { bookingId, traineeId } = req.body;
  const result = await ClassBookingService.cancelBookingService(
    bookingId,
    traineeId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Class booking cancelled successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const traineeId = req.user?.id;
  const result = await ClassBookingService.getMyBookings(traineeId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

export const ClassBookingControllers = {
  createClassBooking,
  cancelClassBooking,
  getMyBookings
};
