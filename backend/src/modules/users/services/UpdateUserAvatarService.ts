import path from 'path';
import fs from 'fs';
import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

import uploadConfig from '@config/upload';

interface Request{
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarSevice{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ){}

    public async execute({ user_id, avatarFilename }: Request): Promise<User>{
        const user = await this.usersRepository.findByID(user_id);

        if(!user){
            throw new AppError('Only authenticated users can change avatar', 401);
        }

        if(user.avatar){
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            const userVatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userVatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarSevice;
