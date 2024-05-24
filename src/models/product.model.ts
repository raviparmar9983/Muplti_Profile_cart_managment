import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../db/db.connection";
import { Cart } from "./cart.model";

export class Product extends Model<InferAttributes<Product>,InferCreationAttributes<Product>>{
    declare id?:CreationOptional<number>;
    declare name:string;
    declare description:string;
    declare price:number;
}


Product.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            notNull:{
                msg:'name not null'
            },
            notEmpty:{
                msg:'name is required'
            }
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notNull:{
                msg:"price is needed"
            },
            notEmpty:{msg:'price musy not empty'}
        }
    } 

},{
    sequelize,
    freezeTableName:true
});
