import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ClassScheduleControllers } from './class-schedule.controller';


const router = Router();


router.post('/', auth(UserRole.ADMIN), ClassScheduleControllers.createSchedule);
router.get('/',  ClassScheduleControllers.getAllSchedulesService);

export const ClassScheduleRoutes = router;
