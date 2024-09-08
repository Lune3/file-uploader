const {Router} = require('express');
const prisma = require('../db.js');
const subFolder = require('./subfolder.js');

const drive = Router();

drive.get('/',async (req,res) => {
    const folders = await prisma.folder.findMany({
        where:{
            parentId:req.session.user.rootFolder
        }
    })
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
            parentId:user.rootFolder
        }
    })
    console.log(newFolder);
    res.redirect(`/drive`);
});

drive.use('/:folderId',subFolder);

module.exports = drive;