const {Router} = require('express');
const passport = require('../config/passport.js');

const login = Router();

login.get("/",(req,res) => {
    res.render("login");
})

login.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

module.exports = login;