import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { ClassScheduleRoutes } from '../modules/Class-schedule/class-schedule.route';
import { ClassBookingRoutes } from '../modules/Booking/class-booking.route';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/schedule',
    route: ClassScheduleRoutes,
  },
  {
    path: '/booking',
    route: ClassBookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
