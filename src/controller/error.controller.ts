
import { Request,Response,NextFunction } from "express"

const handlerDbUnique=(err:any,res:Response)=>{
    let messages=err.errors.map((er:any)=>`${er.path} with ${er.value} is already exist `)
    res.status(400).json({
        message:err.message,
        err_name:err.name,
        messages,
        err
    })
}

const handleDbValidation=(err:any,res:Response)=>{
    let messages=err.errors.map((er:any)=>`${er.path} is requires`)
    res.status(400).json({
        message:err.message,
        err_name:err.name,
        messages,
        err
    })
}

const handlerForignKey=(err:any,res:Response)=>{
    res.status(404).json({
        message:'the id you are trying to insert is not present in ',
        name:err.name,
        details:err.details
    })
}

const handlerDbError=(err:any,res:Response)=>{
    console.log("call");
    
    res.status(404).json({
        message:err.message,
        hint:err.hint,
    })
}

export default (err:any,req:Request,res:Response,next:NextFunction)=>{
    err.status=err.status || 500;
    err.message=err.message || 'Internal Server Error'
  
    if(err.name=='SequelizeUniqueConstraintError')return handlerDbUnique(err,res)
    if(err.name=='SequelizeValidationError')return handleDbValidation(err,res)
    if(err.name=="SequelizeForeignKeyConstraintError")return handlerForignKey(err,res)
    if(err.name=="SequelizeDatabaseError")return handlerDbError(err,res)
    res.status(err.status).json({
        message:err.message,
        err
    })
}