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

// get all trainers & delete
router.get('/trainers',  UserControllers.getAllTrainers);

router.delete(
  '/trainers/:id',
  auth(UserRole.ADMIN),
  UserControllers.deleteTrainer,
);

// profile get and update
router.get(
  '/me',
  auth(UserRole.TRAINEE, UserRole.TRAINER, UserRole.ADMIN),
  UserControllers.getMyProfile,
);
router.put(
  '/me',
  auth(UserRole.TRAINEE, UserRole.TRAINER, UserRole.ADMIN),
  multerUpload.single('file'),
  validationRequest(userValidation.updateUserValidationSchema),
  (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (file) {
      req.body.profileImage = file.path;
    }
    UserControllers.updateMyProfile(req, res, next);
  },
);
export const UserRoutes = router;
