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
            res.sendStatus(400).send("user already exist");
        }
        else{
            const hashPassword = await bcrypt.hash(user.password,10);
            const user = await prisma.user.create({
                data:{
                    username:user.username,
                    password:hashPassword
                }
            });
        }
    }
    catch(err){
        console.log(err);
    }
  res.redirect("/login");
});

module.exports = indexRoute;