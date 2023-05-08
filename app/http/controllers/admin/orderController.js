const Order = require("../../../model/order")

function orderController(){
    return {
        async index(req, res){
           Order.find({ status: { $ne: 'completed' } }, null, { sort: {'createdAt': -1}} ).populate('customerId', '-password').then((orders)=> {
                if(req.xhr){
                    return res.json(orders)
                }
                return res.render('admin/orders')
            }).catch(err=> {
                console.log(err)
            })
        }
    }
}

module.exports = orderController