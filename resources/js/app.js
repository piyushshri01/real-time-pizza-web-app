import axios from "axios";
import Noty from 'noty';
import {initAdmin} from './admin'
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


addToCart.forEach((btn)=> {
    btn.addEventListener('click', ()=> {
        let pizza = JSON.parse(btn.dataset.pizza)
        // console.log(pizza)
        updateCart(pizza)
    })
})

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=> {
        cartCounter.innerText = res.data.totalQty 
        new Noty({
            text: 'Item added to cart',
            type: 'success',
            timeout: 2000
        }).show();
        console.log(res)
    }).catch(err=> {
        new Noty({
            text: 'something went wrong',
            type: 'error',
            timeout: 2000
        }).show();
    })

}

// remove success alert message after order successfully completion 
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove()
    },2000)
}

initAdmin()