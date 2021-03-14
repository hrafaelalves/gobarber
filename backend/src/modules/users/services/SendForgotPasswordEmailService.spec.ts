import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProviders/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPaswordEmail: SendForgotPasswordEmailService;
let fakeUserTokenRepository: FakeUserTokenRepository;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        sendForgotPaswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository);
        
    });


    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:  '123456'
        });

        await sendForgotPaswordEmail.execute({
           email: "johndoe@example.com",
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non existing user password', async () => {
        await expect(sendForgotPaswordEmail.execute({
            email: "johndoe@example.com",
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forget password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:  '123456'
        });

        await sendForgotPaswordEmail.execute({
           email: "johndoe@example.com",
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
})