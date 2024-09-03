const {Router} = require('express');
const passport = require('../config/passport.js');
const prisma = require('../db.js');

const login = Router();

login.get("/",(req,res) => {
    res.render("login");
})

const successRouter = async (req,res) => {
    const user = req.body.user;
    const id = await prisma.user.findUnique({
        where:{
            username:user
        },
        select:{
            rootFolder:true
        }
    })
    res.render("/drive",{id:id});
}

login.post("/", passport.authenticate("local", {
    failureRedirect: "/"
}),successRouter);

module.exports = login;