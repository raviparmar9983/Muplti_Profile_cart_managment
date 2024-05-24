import { inject, injectable } from "inversify";
import { TYPE } from "inversify-express-utils";
import TYPES from "../types/type";
import { Cart } from "../models/cart.model";
import { CartProduct } from "../models/cartProduct.model";
import { InferAttributes } from "sequelize";
import { Product } from "../models/product.model";

@injectable()
export class CartService{
    
    constructor(@inject(TYPES.cart)private cart:typeof Cart,@inject(TYPES.cartProduct)private cartProduct:typeof CartProduct){}
    
    public async createCart(profileId:number){
        return await this.cart.create({profileId})
    }
    public async deleteCart(profileId:number){
        return await this.cart.destroy({where:{profileId}})
    }
    public  async getCart(profileId:number){
        const cart= await this.cart.findOne({where:{profileId}})
        if(!cart){
            return await this.createCart(profileId);
        }
        return cart
    }
    public async addToCart(cartItem:InferAttributes<CartProduct>){
        return this.cartProduct.create(cartItem);
    }
    public async delete(cartId:number,productId:number){
        return this.cartProduct.destroy({where:{CartId:cartId,ProductId:productId}})
    }
    public async update(cartId:number,productId:number,update:any){
        return this.cartProduct.update(update,{where:{CartId:cartId,ProductId:productId}})
    }
}