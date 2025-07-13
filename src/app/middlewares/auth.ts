import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import config from '../config';
import { Secret } from 'jsonwebtoken';
import prisma from '../shared/prisma';
import AppError from '../error/AppError';
import { UserStatus } from '@prisma/client';
import { verifyToken } from '../utils/useToken';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.headers.authorization!;
      if (!token) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access. You must be an admin to perform this action.");
      }

      const verifyUser = verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as Secret,
      );

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access. You must be an admin to perform this action.");
      }

      const userData = await prisma.user.findUnique({
        where: {
          email: verifyUser.email,
          userStatus: UserStatus.ACTIVE,
        },
      });

      if (!userData) {
        throw new AppError(status.NOT_FOUND, 'User is Not Found!');
      }
      req.user = userData;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
