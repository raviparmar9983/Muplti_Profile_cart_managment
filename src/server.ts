import * as bodyParse from 'body-parser'
import express from 'express'
import "reflect-metadata"
import { InversifyExpressServer } from 'inversify-express-utils'
import dotenv from 'dotenv'
dotenv.config({path:'./src/config.env'})
import container from './inversify.config'
import errorController from './controller/error.controller'
const server=new InversifyExpressServer(container,null,{rootPath:'/shop'})
server.setConfig((app)=>{
    app.use(express.json())
    app.use(bodyParse.urlencoded({extended:true}))
}).setErrorConfig((app)=>{
    app.use(errorController)
})

const app=server.build()

app.listen(8080,()=>{
    console.log("server started successfully");
})