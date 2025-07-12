import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClassScheduleService } from './class-schedule.service';

const createSchedule = catchAsync(async (req, res) => {
  const result = await ClassScheduleService.createScheduleService(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
});
const getAllSchedulesService = catchAsync(async (req, res) => {
  const result = await ClassScheduleService.getAllSchedulesService();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Get all schedules successfully',
    data: result,
  });
});

export const ClassScheduleControllers = {
  createSchedule,
  getAllSchedulesService
};
