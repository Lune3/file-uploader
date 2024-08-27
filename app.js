require('dotenv').config();

const express = require('express');
const path = require("node:path");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const expressSession = require('express-session');


const app = express();

app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
      resave: true,
      saveUninitialized: true,
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/",(req,res) => {
    res.render("index");
})



app.listen(process.env.PORT,() => {
    console.log(`server running`);
})