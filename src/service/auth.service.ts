import { inject, injectable } from "inversify";
import TYPES from "../types/type";
import User from "../models/user.model";
import jwt from 'jsonwebtoken'
import { IUser } from "../interface/user.interface";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";
@injectable()
export class AuthService{
    constructor(@inject(TYPES.User)private user:typeof User){}
    public async signup(user:IUser):Promise<IUser>{
        return await this.user.create(user);
    }
    public async login(email:string,password:string){
        const user:IUser|null=await this.user.findOne({where:{email}})
        if(!user)throw new CustomeError(StatusConstants.NOT_FOUND.httpStatusCode,'User not exist')
        if(! await (user as any).comparePassword(password)){
            throw new CustomeError(401,'password is not correct')
        }
        const token:string=jwt.sign({email},process.env.SECRET_KEY!);
        return token
    }
}
