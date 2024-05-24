import { inject, injectable } from "inversify";
import TYPES from "../types/type";
import User from "../models/user.model";
import jwt from 'jsonwebtoken'
import { IUser } from "../interface/user.interface";
import Profile from "../models/profile.model";
import { InferAttributes } from "sequelize";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";


@injectable()
export class ProfileService{
    constructor(@inject(TYPES.profile)private profile:typeof Profile){}
    public async createProfile(profile:InferAttributes<Profile>){
        return await this.profile.create(profile);
    }
    public async getAll(userId:number){
        return await this.profile.findAll({where:{userId}})
    }
    public async deleteProfile(userId:number,profileId:number){
        return await this.profile.destroy({where:{id:profileId,userId}})
    }
    public async switchProfile(userId:number,profileId:number,email:string){
        const profile:Profile|null=await this.profile.findByPk(profileId);
        if(!profile)throw new CustomeError(StatusConstants.RESOURCE_NOT_FOUND.httpStatusCode,'profile not exist select another one')
        const token:string=jwt.sign({userId,profileId,email},process.env.SECRET_KEY!);
        return token
    }
}