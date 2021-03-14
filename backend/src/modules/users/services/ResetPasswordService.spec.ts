import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let resetPassword: ResetPasswordService;
let fakeUserTokenRepository: FakeUserTokenRepository;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository);
    });


    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password:  '123456'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        await resetPassword.execute({
            password: '123123',
            token
        });

        const updatedUser = await fakeUsersRepository.findByID(user.id);

        expect(updatedUser?.password).toBe('123123');
    });
});

// Hash
// 2h de expiração
// User token inexistente
// User inexistente