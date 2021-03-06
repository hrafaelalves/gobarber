import { Request, Response } from "express";
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController{
    public async create(request: Request, response: Response): Promise<Response>{
        // try{
            const { email, password } = request.body;
        
            const autheticateUser = container.resolve(AuthenticateUserService);
    
            const { user, token } = await autheticateUser.execute({
                email,
                password
            });
    
            delete user.password;
    
            return response.json({ user, token });
        // }catch(err){
        //     console.log(err);
        //     return response.send(err);
        // }
    }
}