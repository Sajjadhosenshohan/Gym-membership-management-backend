import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { ClassScheduleRoutes } from '../modules/Class-schedule/class-schedule.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
