const Menu = require("../../model/menu")
function homeController(){
    return{
        async home(req, res){
            const pizzas = await Menu.find()
            return res.render('home', {pizzas: pizzas})
        }
    }
}

module.exports = homeController