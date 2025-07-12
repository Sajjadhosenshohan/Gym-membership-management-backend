import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import pick from '../../shared/pick';
import { User } from '@prisma/client';

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: { accessToken: result.accessToken },
  });
});
const createTrainer = catchAsync(async (req, res) => {
  const result = await UserService.createTrainer(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainer created successfully',
    data: { accessToken: result.accessToken },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserService.loginUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User login successfully',
    data: { accessToken: result.accessToken },
  });
});

export const getAllTrainers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllTrainers(options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainers retrieved successfully',
    data: result,
  });
});

export const deleteTrainer = catchAsync(async (req, res) => {
  const trainerId = req.params.id;
  const result = await UserService.deleteTrainer(trainerId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainer deleted successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  createTrainer,
  loginUser,
  getAllTrainers,
  deleteTrainer,
};
