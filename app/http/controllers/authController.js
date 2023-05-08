const bcrypt = require('bcrypt');
const User = require("../../model/user")
const passport = require('passport')

function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next){
            const {email, password} = req.body
            console.log(email, password, "user")
            // validate request
            if(!email || !password){
                req.flash('error', "All fields are required")
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info)=> {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')

                }
                req.logIn(user, (err)=> {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)

        },
        register(req, res){
            res.render('auth/register')
        },
        async postRegister(req, res){
            try{
                const {name, email, password} = req.body;
                if (!name || !email || !password){
                    req.flash('error', "All fields are required")
                    req.flash('name', name)
                    req.flash('email', email)

                    return res.redirect('/register')
                }
                // Check if email exist
                const user = await User.findOne({email})
                console.log(user,"user")
                if (user){
                    req.flash('error', "Email already taken")
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
                        
                // hashed password
                const hashedPassword = await bcrypt.hash(password, 10)
                // create a new user
                console.log(name, email, password, hashedPassword)
                const newUser = new User({name, email, password:hashedPassword})
                console.log(newUser, "newUser")

                await newUser.save()
                return res.redirect("/")
                
            }catch(err){
                console.log(err)
                req.flash('error', 'something went wrong')
                return res.redirect('/register')
            }
        },
        logout(req, res){
            const cartData = req.session.cart;  // get cart data from old session
            req.logout((err) => {
                if (err) {
                  console.error(err);
                  return next(err);
                }
            });
            req.session.regenerate((err) => {
                if (err) {
                console.error(err);
                return next(err);
                }
                // merge cart data into new session
                req.session.cart = Object.assign({}, cartData);
                res.redirect('/login');
            });
        }
    }

}

module.exports = authController