require('dotenv').config();

const express = require('express');
const path = require("node:path");

const app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/",(req,res) => {
    res.render("index");
})



app.listen(process.env.PORT,() => {
    console.log(`server running`);
})