import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest{
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService{

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository,
    ){}

    public async execute({ token, password }: IRequest): Promise<void>{
        const userToken = await this.userTokensRepository.findByToken(token);

        if(!userToken){
            throw new AppError('User token does not exist');
        }

        const user = await this.usersRepository.findByID(userToken.user_id);

        if(!user){
            throw new AppError('User does not exist');
        }

        user.password = password;

        await this.usersRepository.save(user);
    }

}

export default ResetPasswordService;
