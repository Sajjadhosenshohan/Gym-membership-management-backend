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

const getAllTrainers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllTrainers(options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainers retrieved successfully',
    data: result,
  });
});

const deleteTrainer = catchAsync(async (req, res) => {
  const trainerId = req.params.id;
  await UserService.deleteTrainer(trainerId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Trainer deleted successfully',
    data: null,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await UserService.getMyProfile(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await UserService.updateMyProfile(userId, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  createTrainer,
  loginUser,
  getAllTrainers,
  deleteTrainer,
  getMyProfile,
  updateMyProfile,
};
