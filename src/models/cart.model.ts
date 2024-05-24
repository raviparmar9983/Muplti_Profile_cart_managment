import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import Profile from "./profile.model";
import sequelize from "../db/db.connection";




export class Cart extends Model<InferAttributes<Cart>,InferCreationAttributes<Cart>>{
    declare id?:number;
    declare profileId:ForeignKey<number>
}


Cart.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    profileId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Profile,
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

Profile.hasOne(Cart,{foreignKey:'profileId'})
Cart.belongsTo(Profile,{foreignKey:'profileId'});


(async ()=>{
    await Cart.sync({alter:true})
    await Cart.findAll()
})()
