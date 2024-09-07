const {Router} = require('express');
const passport = require('../config/passport.js');
const prisma = require('../db.js');

const login = Router();

login.get("/",(req,res) => {
    res.render("login");
})

const successRouter = async (req,res) => {
    const username = req.body.username;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const pullUser = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!pullUser) {
            return res.status(404).send('User not found');
        }
        req.session.user= pullUser;
        res.redirect(`/drive`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

login.post("/", passport.authenticate("local", {
    failureRedirect: "/"
}),successRouter);

module.exports = login;