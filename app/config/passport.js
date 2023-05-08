const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user')
const bcrypt = require("bcrypt")
function init(passport){
    passport.use(new LocalStrategy({ usernameField: 'email'}, async (email, password, done)=> {
        // Login
        // check if email exist
        const user = await User.findOne({email})
        if (!user){
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match=>{
            if(match){
                return done(null, user, {message: 'Logged in successful'})
            }
            return done(null, false, {message: 'wrong username and password'})
        }).catch(err=> {
            return done(null, false, {message: 'something went wrong'})
        })
    }))

    passport.serializeUser((user, done)=> {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done)=> {
        const user = await User.findById(id)
        if(user){
            done(null, user)
        }else{
            done(null, false, {message: 'something went wrong'})
        }
        
    })

}

module.exports = init