import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { multerUpload } from '../../config/multer.config';
import { validationRequest } from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';

const router = Router();

router.post(
  '/register-user',
  auth(UserRole.ADMIN, UserRole.TRAINEE),
  multerUpload.single('file'),
  validationRequest(userValidation.createUserValidationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (file) {
      req.body.profileImage = file.path;
    }
    UserControllers.createUser(req, res, next);
  },
);

router.post(
  '/register-trainer',
  auth(UserRole.ADMIN),
  multerUpload.single('file'),
  validationRequest(userValidation.createUserValidationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (file) {
      req.body.profileImage = file.path;
    }
    UserControllers.createTrainer(req, res, next);
  },
);

router.post(
  '/login',
  validationRequest(userValidation.loginValidationSchema),
  UserControllers.loginUser,
);

router.get('/users/trainers', auth(UserRole.ADMIN), UserControllers.getAllTrainers);
router.delete('/users/trainers/:id', auth(UserRole.ADMIN), UserControllers.deleteTrainer);

export const UserRoutes = router;
