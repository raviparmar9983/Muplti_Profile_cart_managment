import { inject } from "inversify";
import { controller, httpPost, request, response, next } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import TYPES from "../types/type";
import { AuthService } from "../service/auth.service";
import axios from "axios";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";



@controller('/user')
class UserController {
    constructor(@inject<AuthService>(TYPES.authService) private authService: AuthService) { }

    @httpPost('/signup')
    private async signup(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const { email, password, confirmPassword } = req.body;
            if (!email || !password || !confirmPassword) {
                return next(new CustomeError(StatusConstants.BAD_REQUEST.httpStatusCode,'email , password and confirm password is required'))
            }
            const newUser = await this.authService.signup({ email, password, confirmPassword });
            res.status(201).json({
                newUser
            })
        }
        catch (err) {
            return next(err)
        }
    }
    @httpPost('/login')
    private async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const token = await this.authService.login(req.body.email, req.body.password);
            const apiresponce=await axios.get('http://localhost:8080/shop/user/profile',{
                headers:{Authorization:`Bearer ${token}`}
            })
            res.status(200).json({
                token,
                profile:apiresponce.data
            })
        }
        catch (err:any) {
            return next(err)
        }
    }

}