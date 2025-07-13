import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ClassBookingControllers } from './class-booking.controller';


const router = Router();


router.post('/create-booking',auth(UserRole.TRAINEE), ClassBookingControllers.createClassBooking);
router.delete('/cancel-booking',auth(UserRole.TRAINEE, UserRole.ADMIN), ClassBookingControllers.cancelClassBooking);

router.get('/my-bookings', auth(UserRole.TRAINEE), ClassBookingControllers.getMyBookings);
export const ClassBookingRoutes = router;
 
