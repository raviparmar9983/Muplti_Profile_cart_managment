import { inject } from "inversify";
import TYPES from "../types/type";
import { ProfileService } from "../service/profile.service";
import { controller, httpPost, request, response, next, httpGet, httpDelete, requestParam } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import sequelize from "../db/db.connection";
import { Cart } from "../models/cart.model";
import CustomeError from "../utils/custome.error";
import StatusCode from "../utils/statusCode";
import StatusConstants from "../utils/status.constant";





@controller('/user/profile',TYPES.authUserMiddlerWare)
class ProfileController{
    constructor(@inject(TYPES.profileService)private profileService: ProfileService){}
    @httpPost('/')
    private async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        const transaction=await sequelize.transaction()
        try{
                const name:string=req.body.name||" ";
                const userId:number=req.userId!
                if(!userId || !name)return next( new CustomeError(StatusConstants.BAD_REQUEST.httpStatusCode,'user id and name is required please login again an try'))
                const newProfile=await this.profileService.createProfile({name,userId})
                await Cart.create({profileId:newProfile.id!})
                await transaction.commit()
                res.status(201).json({
                    newProfile
                })
                
        }
        catch(err:any){
            await transaction.rollback()
            next(err)
            
        }
    }
    @httpGet('/')
    private async getAll(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const userId:number=req.userId!
            if(!userId){
                return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,"Logout please login again"))
            }
            const profile=await this.profileService.getAll(userId);
            res.status(200).json(profile)
        }
        catch(err:any){
            next(err)
        }
    }
    @httpDelete('/:id')
    private async deleteOne(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const userId:number=req.userId!
            if(!userId){
                return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,"Logout please login again"))
            }
            const deleted=await this.profileService.deleteProfile(userId,id)
            res.status(200).json({
                staus:"success"
            })
        }
        catch(err:any){
            next(err)
        }
    }
    @httpGet('/switch/:id')
    private async swithProfile(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const userId:number=req.userId!
            const profileId:number=id;
            const email:string=req.email!
            if(!userId){
                return next(new CustomeError(StatusConstants.UNAUTHORIZED.httpStatusCode,"Logout please login again"))
            }
           const token=await this.profileService.switchProfile(userId,profileId,email);
           res.status(200).json({
                token
           })
        }
        catch(err:any){
            next(err)
        }
    }
}