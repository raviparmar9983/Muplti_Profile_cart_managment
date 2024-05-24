import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { ParsedQs } from "qs";
import { verifyAsync } from "./auth.middlerware";
import TYPES from "../types/type";
import Profile from "../models/profile.model";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";



@injectable()
export class ProfileAuthenticationMiddlerware extends BaseMiddleware{
    constructor(@inject(TYPES.profile)private profile:typeof Profile){super()}
    public  async handler(req: Request, res: Response, next: NextFunction) {
        try{
            let token;
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                token=req.headers.authorization.split(' ')[1];
            }
            if(!token){
                return next(new CustomeError(StatusConstants.PERMISSION_DENIED.httpStatusCode,'token not found please login again'))
            }
            const payload=await verifyAsync(token,process.env.SECRET_KEY!)
            const id=payload.profileId;
            if(!id)return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,'Profile not found '))
            const profile=await this.profile.findByPk(id)
            if(!profile)return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,'Profile not found '))
            req.profileId=profile.id;
            next()    
        }
        catch(err:any){
            next(err)
        }
    }
}