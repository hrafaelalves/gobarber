import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRoutes = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRoutes.post('/', usersController.create);

usersRoutes.patch('/avatar', 
    ensureAuthenticated, 
    upload.single('avatar'), 
    userAvatarController.update
);

export default usersRoutes;
