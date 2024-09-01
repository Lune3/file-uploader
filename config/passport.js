const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


passport.use(new localStrategy(async(username,password,done) => {
    try{
        const user = await prisma.user.findUnique({
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

passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
  
      if (!user) {
        return done(new Error('User not found'), null);
      }
  
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

module.exports = passport;