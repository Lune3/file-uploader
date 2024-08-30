require('dotenv').config();
const express = require('express');
const path = require("node:path");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const expressSession = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const login = require('./routes/log-in.js')


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true}));

app.use(
    expressSession({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

app.use(passport.session());
  
app.get("/",(req,res) => {
    res.render("index");
})

app.post("/",(req,res) => {
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

app.use('/login',login);




app.listen(process.env.PORT,() => {
    console.log(`server running`);
})