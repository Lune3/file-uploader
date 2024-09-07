const {Router} = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const drive = Router();

drive.get('/',async (req,res) => {
    const folders = await prisma.folder.findMany({
        where:{
            parentId:req.session.user.rootFolder
        }
    })
    console.log(folders);
    res.render("drive",{folders:folders});
});

drive.get(`/newFolder`,(req,res) =>{
    res.render("folders");
});

drive.post('/newFolder',async(req,res) => {
    const user = req.session.user;
    const newFolder = await prisma.folder.create({
        data:{
            name:req.body.folderName || 'Untitled Folder',
            parentFolder:{connect:{id:user.rootFolder}},
            user:{connect:{id:user.id}}
        }
    })
    console.log(newFolder.name);
    res.redirect(`/drive`);
});

module.exports = drive;