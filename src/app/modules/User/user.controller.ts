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

export const UserControllers = {
  createUser,
  createTrainer,
  loginUser
};
