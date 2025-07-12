import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import status from 'http-status';

export const validationRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let parsedData: any;

    if (req.body?.data) {
      try {
        parsedData = JSON.parse(req.body.data);
      } catch (err) {
        sendResponse(res, {
          statusCode: status.BAD_REQUEST,
          success: false,
          message: 'Invalid JSON format in form-data "data" field',
        });
        return;
      }
    } else {
      parsedData = req.body;
    }

    await schema.parseAsync({ body: parsedData });

    req.body = parsedData;

    next();
  });
};

