const {Router} = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const indexRoute = Router();

indexRoute.get("/",(req,res) => {
    res.render("index");
})

indexRoute.post("/",(req,res) => {
    const user = {username:req.body.username,password:req.body.password};
    bcrypt.hash(user.password,10,async(err,hash) => {
      if(err)console.log(err);
      else{
        const newUser = await prisma.user.create({
          data:{
            username: `${user.username}`,
            password: `${hash}`
          },
        }) 
      }
  })
  res.redirect("/login");
})

module.exports = indexRoute;