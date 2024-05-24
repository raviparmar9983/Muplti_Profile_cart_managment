import "reflect-metadata"
import { Container } from "inversify";
import sequelize from "./db/db.connection";
import { Sequelize } from "sequelize";
import TYPES from "./types/type";
import User from "./models/user.model";
import { AuthService } from "./service/auth.service";
import Profile from "./models/profile.model";
import { ProfileService } from "./service/profile.service";
import { AuthUserMiddler } from "./middlerware/auth.middlerware";
import { Cart } from "./models/cart.model";
import { Product } from "./models/product.model";
import { CartProduct } from "./models/cartProduct.model";
import { ProductService } from "./service/product.service";
import { ProfileAuthenticationMiddlerware } from "./middlerware/profile.auth.middlerware";
import { CartService } from "./service/cart.service";



import './controller/cart.controller'
import './controller/user.controller'
import './controller/profile.controller'
import './controller/product.controller'
const container=new Container();


// MODELS
container.bind<Sequelize>(TYPES.sequelize).toConstantValue(sequelize)
container.bind(TYPES.User).toConstantValue(User)
container.bind(TYPES.profile).toConstantValue(Profile)
container.bind(TYPES.cart).toConstantValue(Cart)
container.bind(TYPES.cartProduct).toConstantValue(CartProduct)
container.bind(TYPES.product).toConstantValue(Product)

// SERVICE
container.bind(TYPES.profileService).to(ProfileService);
container.bind(TYPES.authUserMiddlerWare).to(AuthUserMiddler)
container.bind<AuthService>(TYPES.authService).to(AuthService)
container.bind(TYPES.productService).to(ProductService)
container.bind(TYPES.profileAuthenticationMiddlerware).to(ProfileAuthenticationMiddlerware)
container.bind(TYPES.cartService).to(CartService)

export default container