import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProviders/models/IMailProvider';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest{
    email: string;
}

@injectable()
class SendForgotPasswordEmailService{

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokenRepository,
    ){}

    public async execute({ email }: IRequest): Promise<void>{
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new AppError('User does not exist.')
        }

        await this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido');
    }

}

export default SendForgotPasswordEmailService;
