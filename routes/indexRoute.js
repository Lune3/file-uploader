const {Router} = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const indexRoute = Router();

indexRoute.get("/",(req,res) => {
    res.render("index");
})

indexRoute.post("/",async (req,res) => {
    const user = {username:req.body.username,password:req.body.password};
    try{
        const userExist = await prisma.user.findUnique({
            where:{
                username:user.username,
            }
        })
        if(userExist){
            res.status(400).send("user already exist");
        }
        else{
            const hashPassword = await bcrypt.hash(user.password,10);
            const newUser = await prisma.user.create({
                data:{
                    username:user.username,
                    password:hashPassword
                }
            });
            res.redirect("/login");
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = indexRoute;