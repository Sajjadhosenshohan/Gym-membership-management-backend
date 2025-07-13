import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClassScheduleService } from './class-schedule.service';
import pick from '../../shared/pick';

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
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ClassScheduleService.getAvailableSchedulesService(options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Get all schedules successfully',
    data: result,
  });
});

const getTrainerSchedules = catchAsync(async (req, res) => {
  const userId = req.user?.id;
   const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ClassScheduleService.getTrainerSchedulesService(userId, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainer class schedules fetched successfully',
    data: result
  });
});
export const ClassScheduleControllers = {
  createSchedule,
  getAllSchedulesService,
  getTrainerSchedules
};
