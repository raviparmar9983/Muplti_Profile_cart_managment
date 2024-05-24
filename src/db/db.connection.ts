import { Sequelize,Op } from "sequelize";

const DB:string=process.env.DB!
const USER:string=process.env.USER!
const PASSWORD:string=process.env.PASSWORD!

const sequelize=new Sequelize(DB,USER,PASSWORD,{
    host:'localhost',
    dialect:'postgres',
    logging:false,
    operatorsAliases:{
        $gt:Op.gt,
        $gte: Op.gte,
        $lt: Op.lt,
        $lte: Op.lte,
        $eq: Op.eq,
        $ne: Op.ne,
        $or: Op.or,
        $and: Op.and,
        $like: Op.like,
        $ilike:Op.iLike
    }
})

export default sequelize;