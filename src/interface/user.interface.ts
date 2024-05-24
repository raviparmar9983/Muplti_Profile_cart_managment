import { Optional } from "sequelize"

export interface IUser{
    id?:number,
    email:string,
    password:string,
    confirmPassword:string,
}
export  type UserCreationAttributes=Optional<IUser,'id'>
