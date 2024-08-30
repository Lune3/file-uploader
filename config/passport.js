const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


passport.use(new localStrategy(async(username,password,done) => {
    try{
        const {user} = await prisma.user.findMany({
            where:{
                username:`${username}`
            }
        })

        if(!user){
            return done(null,false,{message:"Incorrect Username"});
        }

        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return done(null,false,{message:"Incorrect password"});
        }
        return done(null,user);
    }
    catch(err){
        return done(err);
    }
}));

passport.serializeUser((user,done) => {
    done(null,user.id);
})

passport.deserializeUser(async (id,done)=>{
    try{
        const {rows} = await prisma.user.findMany({
            where:{
                id:id,
            }
        });
        const user = rows[0];

        done(null,user);
    }
    catch(err){
        done(err);
    }
})