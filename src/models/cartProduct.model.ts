import { DataTypes, ForeignKeyConstraintError, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Cart } from "./cart.model";
import { Product } from "./product.model";
import sequelize from "../db/db.connection";

export class CartProduct extends Model<InferAttributes<CartProduct>,InferCreationAttributes<CartProduct>>{
    declare id?:number;
    declare CartId:number;
    declare ProductId:number;
    declare quantity:number;
}

CartProduct.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    CartId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Cart,
            key:'id'
        },
        onDelete:'CASCADE'
    },
    ProductId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Product,
            key:'id'
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
    }
},{
    sequelize,
    freezeTableName:true
})

Cart.belongsToMany(Product,{through:CartProduct})
Product.belongsToMany(Cart,{through:CartProduct});


(async ()=>{
    await Product.sync({alter:true})
    await CartProduct.sync({alter:true})
}
)()