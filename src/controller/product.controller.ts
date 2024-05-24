import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPatch, httpPost, next, request, requestParam, response } from "inversify-express-utils";
import TYPES from "../types/type";
import { NextFunction,Request,Response } from "express";
import { ProductService } from "../service/product.service";
import CustomeError from "../utils/custome.error";
import { ApiFeature } from "../utils/ApiFeature";
import { Product } from "../models/product.model";
import StatusConstants from "../utils/status.constant";


@controller('/product')
class ProductController{
    constructor(@inject(TYPES.productService)private productService :ProductService){}
    
    @httpPost('/')
    private async create(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{    
            const {name,price,description}=req.body
            if(!name || !price || !description) return next(new CustomeError(StatusConstants.BAD_REQUEST.httpStatusCode,'price , name and description is needed'))
            const product=await this.productService.create({...req.body})
            res.status(200).json({
                product
            })
        }
        catch(err:any){
            next(err)
        }
    }
    @httpGet('/',TYPES.profileAuthenticationMiddlerware)
    private async getAll(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{    
            const app=  new ApiFeature(req.query,Product).filter()
            .search().sort().feilds().paging()    
            console.log(app.arr[0]);

            const product=await Product.findAll(app.arr[0])
            
            res.status(200).json({
                product
            })
        }
        catch(err:any){
            next(err)
        }
    }
    @httpPatch('/:id')
    private async update(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            let obj=req.body;
            const updated=await this.productService.update(id,{...obj});
            res.status(200).json(updated);
        }catch(err:any){
            next(err)
        }
    }
    @httpDelete('/:id')
    private async delete(@requestParam("id")id:number,@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try{
            const deleted=await this.productService.delete(id);
            res.status(200).json({
                staus:'success',
                deleted
            })
        }catch(err:any){
           next(err)
        }
    }
}