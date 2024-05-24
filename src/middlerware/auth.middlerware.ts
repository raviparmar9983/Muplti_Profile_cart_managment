import { BaseMiddleware } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { controller, httpPost, request, response, next } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import util from 'util'
import TYPES from "../types/type";
import User from "../models/user.model";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";


declare module 'express'{
    interface Request{
        userId?:number,
        profileId?:number,
        email?:string
    }
}
export const verifyAsync:any=util.promisify(jwt.verify)
@injectable()
export class AuthUserMiddler extends BaseMiddleware{
    constructor(@inject(TYPES.User)private user:typeof  User){super()}

     public async handler(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            let token;
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                token=req.headers.authorization.split(' ')[1];
            }
            if(!token){
                return next(new CustomeError(StatusConstants.PERMISSION_DENIED.httpStatusCode,'token not found please login again'))
            }
            const payload=await verifyAsync(token,process.env.SECRET_KEY)
            const email:string=(payload as JwtPayload).email;
    
            const user:User|null=await this.user.findOne({where:{email}});
     
            if(!user){
                return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,'user not found may be deleted by user'))
            }
            req.userId=(user as any).id;
            req.email=email
            next()
        }catch(err:any){
            next(err)
        }
     }
}


