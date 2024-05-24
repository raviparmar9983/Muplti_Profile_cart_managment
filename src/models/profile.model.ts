import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user.model";
import sequelize from "../db/db.connection";


class Profile extends Model<InferAttributes<Profile>,InferCreationAttributes<Profile,{omit:'id'}>>{
    declare id?:number;
    declare name:string;
    declare userId:number;
}


Profile.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"name is required"
            }
        }
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        },
       onDelete:'CASCADE',
       onUpdate:'CASCADE'
    }
},
{
    sequelize,
    freezeTableName:true
})


User.hasMany(Profile,{
    foreignKey:'userId'
});
Profile.belongsTo(User,{foreignKey:"userId"});


(async ()=>{
    await Profile.sync({alter:true})
})()
export default Profile