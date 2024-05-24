import { inject, injectable } from "inversify";
import { IUser,UserCreationAttributes } from "../interface/user.interface";
import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db.connection";
import bcrypt from 'bcrypt'

@injectable()
class User extends Model<IUser,UserCreationAttributes> implements IUser{
    declare email:string;
    declare password: string;
    declare confirmPassword: string;
    declare comparePassword: (passworf:string)=>Promise<Boolean>;
}

User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true 
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            isEmail:{
                msg:'Enter a valid emial'
            }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:'password is reqquired',
            },
            len:{
                args:[6,10],
                msg:'length of password must greater than 6 '
            }
        }
    },
    confirmPassword:{
        type:DataTypes.STRING,
        allowNull:true,
        validate:{
            notEmpty:{
                msg:'cofirm password is required'
            },
            isSame(val:string){
                if(val!=(this as any).password){
                    throw  new Error('password and confrim password must same')
                }
            }
        }
    }
},{
    sequelize,
    freezeTableName:true,
    hooks:{
        beforeCreate:async (user)=>{
            if(user.password){
                user.password=await bcrypt.hash(user.password,12);
                (user as any).confirmPassword=undefined
            }
        },
        beforeUpdate:async (user)=>{
            if(user.changed('password')){
                user.password=await bcrypt.hash(user.password,12);
                (user as any).confirmPassword=undefined
            }
        }
    },
});

User.prototype.comparePassword=async function (password:string):Promise<Boolean>{
    return await bcrypt.compare(password,this.password)
};

(async ()=>{
    await User.sync({alter:true});
})()


export default User
