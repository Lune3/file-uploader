const {Router} = require('express');
const passport = require('../config/passport.js');

const login = Router();

login.get("/",(req,res) => {
    res.render("login");
})

login.post("/",(req,res) => {
    const user = {username:req.body.username,password:req.body.password};
    passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"/"
    })
})

module.exports = login;