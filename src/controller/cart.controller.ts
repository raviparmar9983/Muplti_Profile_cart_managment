import { inject, namedConstraint } from "inversify";
import { controller, httpDelete, httpGet, httpPatch, httpPost, next, request, requestParam, response } from "inversify-express-utils";
import TYPES from "../types/type";
import { CartService } from "../service/cart.service";
import { Request,Response,NextFunction } from "express";
import { CartProduct } from "../models/cartProduct.model";
import { Cart } from "../models/cart.model";
import { InferAttributes } from "sequelize";
import { Product } from "../models/product.model";
import Profile from "../models/profile.model";
import CustomeError from "../utils/custome.error";
import StatusConstants from "../utils/status.constant";

@controller('/user/profile/cart',TYPES.authUserMiddlerWare)
class CartController{
    constructor(@inject(TYPES.cartService)private cartService: CartService){}
    
    @httpPost('/',TYPES.profileAuthenticationMiddlerware)
    private async insertIntoCart(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const userId:number=req.userId!;
            const profileId:number=req.profileId!;
            const email:string=req.email!;
            const cart:Cart=await this.cartService.getCart(profileId);
            let productId:number=req.body.productId;
            let quantity=req.body.quantity | 1;
            if(!productId )return next(new CustomeError(StatusConstants.BAD_REQUEST.httpStatusCode,'Product id is require'))
            let cartItem:InferAttributes<CartProduct>={
                ProductId:productId,
                CartId:cart.id!,
                quantity
            }
            const created=await this.cartService.addToCart(cartItem);
            res.status(201).json({
                status:'success',
                created
            })
        }catch(err:any){
            next(err)
        }
    }
    @httpGet('/',TYPES.profileAuthenticationMiddlerware)
    private async getCart(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const details=await Cart.findAll({
                include:[
                    {model:Profile},
                    {model:Product}
                ],
                where:{id:req.profileId}
            })

            res.json(details)
        }catch(err:any){
            next(err)
        }
    }
    @httpDelete('/:id',TYPES.profileAuthenticationMiddlerware)
    private async deletefromCart(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const productId=id;
            const profileId:number=req.profileId!;
            const cart:Cart=await this.cartService.getCart(profileId);
            const deleted=this.cartService.delete(cart.id!,productId);
            res.status(200).json({
                status:"succes",
                deleted
            })
        }catch(err:any){
            next(err)
        }
    }
    @httpPatch('/:id',TYPES.profileAuthenticationMiddlerware)
    private async updateCart(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            let {quantity}=req.body
            const productId=id;
            const profileId:number=req.profileId!;
            const cart:Cart=await this.cartService.getCart(profileId);
            const updated=await this.cartService.update(cart.id!,productId, {quantity})
            res.status(200).json({
                updated
            })
        }catch(err:any){
            next(err)
        }
    }
}