import { inject, injectable } from "inversify";
import TYPES from "../types/type";
import { Product } from "../models/product.model";
import CustomeError from "../utils/custome.error";
import { ApiFeature } from "../utils/ApiFeature";
import StatusConstants from "../utils/status.constant";
@injectable()
export class ProductService{
    constructor(@inject(TYPES.product)private product:typeof Product){}
    public async create(product:Product){
        return await this.product.create(product);
    }
    public async delete(productId:number){
        return await this.product.destroy({where:{id:productId}})
    }
    public async update(productId:number,updated:Product){
        const product=await this.product.findByPk(productId)
        if(!product)throw new CustomeError(StatusConstants.NOT_FOUND.httpStatusCode,`No product find with this id = ${productId} `)
        return await product.update(updated)   
    }
    public async getAll(){
        return await this.product.findAll({where:[{price:{$gt:79}}]})
    }
}