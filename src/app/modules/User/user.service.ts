import bcrypt from 'bcryptjs';
import config from '../../config';
import prisma from '../../shared/prisma';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import AppError from '../../error/AppError';
import status from 'http-status';
import { generateToken } from '../../utils/useToken';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';

const registerUser = async (data: Prisma.UserCreateInput) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
      userStatus: UserStatus.ACTIVE,
    },
  });

  if (isUserExist) {
    throw new AppError(status.CONFLICT, 'User already exist');
  }

  const hashedPassword = await bcrypt.hash(
    data.password as string,
    Number(config.BCRYPT_SALt_ROUNDS),
  );

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  // Generate JWT token
  const jwtPayload = {
    email: user.email,
    id: user.id,
    role: user.role,
    name: user.name,
    profileImage: user?.profileImage,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  return {
    accessToken,
  };
};

// user create
const createUser = async (data: User) => {
  if (data.role === UserRole.ADMIN || data.role === UserRole.TRAINER) {
    throw new AppError(
      status.UNAUTHORIZED,
      'Unauthorized access. You must be an admin to perform this action.',
    );
  }

  return await registerUser(data);
};

// trainer create
const createTrainer = async (data: User) => {
  if (data.role && data.role !== UserRole.TRAINER) {
    throw new AppError(status.BAD_REQUEST, 'Only TRAINER role allowed here');
  }

  return await registerUser({
    ...data,
    role: UserRole.TRAINER,
  });
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      userStatus: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(status.UNAUTHORIZED, 'This user is not exist');
  }

  const isCurrentPassword = await bcrypt.compare(
    payload.password,
    userData.password as string,
  );

  if (!isCurrentPassword) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid email or password');
  }

  const jwtPayload = {
    email: userData.email,
    id: userData.id,
    role: userData.role,
    name: userData.name,
    profileImage: userData.profileImage,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES_IN,
  );

  return {
    accessToken,
  };
};

const getAllTrainers = async (options: IPaginationOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const conditions = {
    role: UserRole.TRAINER,
    userStatus: UserStatus.ACTIVE,
  };

  const result = await prisma.user.findMany({
    where: conditions,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.user.count({ where: conditions });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteTrainer = async (trainerId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const trainer = await tx.user.findUnique({
      where: {
        id: trainerId,
        role: UserRole.TRAINER,
        userStatus: UserStatus.ACTIVE,
      },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new AppError(status.NOT_FOUND, 'Trainer not found');
    }
    return await tx.user.update({
      where: { id: trainerId },
      data: { userStatus: UserStatus.DELETED },
    });
  });

  return result;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, userStatus: UserStatus.ACTIVE },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');
  return user;
};

const updateMyProfile = async (userId: string, data: any) => {
  const { role, ...restData } = data;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId, userStatus: UserStatus.ACTIVE },
    });

    if (!user) throw new AppError(status.NOT_FOUND, 'User not found');

    const updatedUserInfo = await tx.user.update({
      where: { id: userId, userStatus: UserStatus.ACTIVE },
      data: { ...restData },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUserInfo;
  });

  return result;
};

export const UserService = {
  createUser,
  createTrainer,
  loginUser,
  getAllTrainers,
  deleteTrainer,
  getMyProfile,
  updateMyProfile,
};
