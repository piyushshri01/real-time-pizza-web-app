const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customers/cartController")
const orderController = require("../app/http/controllers/customers/orderController")
const adminOrderController = require("../app/http/controllers/admin/orderController")
const guest = require('../app/http/middlewares/guest')
const isAuth = require('../app/http/middlewares/isAuth')
const isAdmin = require("../app/http/middlewares/admin")


function initRoutes(app){
    app.get("/", homeController().home)    
    app.get("/login",guest, authController().login)
    app.post("/login", authController().postLogin)

    app.get("/register",guest, authController().register)
    app.post("/register", authController().postRegister)

    app.post('/logout', authController().logout)

    app.get("/cart", cartController().cart)
    app.post("/update-cart", cartController().update)

    app.post("/orders", orderController().store)
    app.get("/customer/orders",isAuth, orderController().index)

    // admin routers
    app.get("/admin/orders",isAdmin, adminOrderController().index)
    

}

module.exports = initRoutes