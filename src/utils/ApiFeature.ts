import { named } from "inversify";
import { where, Op, QueryError } from "sequelize";
import { Json } from "sequelize/types/utils";


const filterBuilders = (queyObj:any) => {
    let obj: any = {}
    Object.keys(queyObj).forEach(key => {
        const val = queyObj[key]
        if (val.lte) {
            obj[key] = { $lte: Number(val.lte) }
        }
        else if (val.lt) {
            obj[key] = { $lt: Number(val.lt) }
        }
        else if (val.gt) {
            obj[key] = { $gt: Number(val.gt) }
        }
        else if (val.gte) {
            obj[key] = { $gte: Number(val.gte) }
        }
        else {
            obj[key] = { $eq: Number(val) }
        }
    })
    return obj
}

export class ApiFeature {
   private queryString: any;
    public Model: any
    public arr: any
    constructor(queryString: any, model: any) {
        this.queryString = queryString,
        this.Model = model;
        this.arr = [{ where: [] }]
    }
    public search(){
        if(this.queryString.search){
            let search=this.queryString.search.trim()
            search=search.split(' ')
            search=search.filter((e:string)=>e.trim()!="")
            let arr:any=[]
            
            let obj=search.map((e:string)=>{
                arr.push({name:{$ilike:`%${e}%`}})
                arr.push({description:{$ilike:`%${e}%`}})
            })
            
            this.arr[0].where.push({$or:arr})
            
        }
        return this
    }
    public  filter() {
        const excludedFeilds = ['sort', 'page', 'feild', 'limit','search']
        let queyObj = { ...this.queryString }
        excludedFeilds.map((e) => delete queyObj[e])
        let obj=filterBuilders(queyObj)
        this.arr[0].where.push(obj)

        console.log(this.queryString);
        

        return this
    }
    public  feilds(){
        this.arr[0].attributes={}
        if(this.queryString.feild){
            let arr=this.queryString.feild.split(',')
            arr=arr.map((e:string)=>e.trim()).filter((e:string)=>e.length>0 && e.charAt(0)!="-")
           this.arr[0].attributes=arr
        }
        else
        this.arr[0].attributes.exclude=["createdAt","updatedAt"]

        return this
    }
    public  sort(){
        this.arr[0].order=[]
        if(this.queryString.sort){
            let arr=this.queryString.sort.split(',')
            arr=arr.map((e:string)=>{
                e=e.trim()
                if(e.length>0)return e
            }).map((e:string)=>{
                if(e.charAt(0)=='-')return [e.substring(1),"DESC"]
                else return [e,"ASC"]
            })
            this.arr[0].order=arr
        }
        else{
            this.arr[0].order.push(["updatedAt","DESC"])
            this.arr[0].order.push(["createdAt","DESC"])
        }

        return this
    }
    public paging(){
    
        let page=this.queryString.page || 1
        let limit=this.queryString.limit || 5
        let offset=(page-1)*limit
        this.arr[0].limit=limit
        this.arr[0].offset=offset
        return this
    }
}