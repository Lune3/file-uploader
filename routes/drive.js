const {Router} = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const drive = Router();

drive.get('/',(req,res) => {
    res.render("drive");
});

drive.get('/newFolder',(req,res) =>{
    res.render("folders");
});

drive.post('/newFolder',async(req,res) => {
    const {newFolder} = req.body.folderName;

    const createFolder = await prisma.F
})

module.exports = drive;