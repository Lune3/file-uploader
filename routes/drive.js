const {Router} = require('express');
const prisma = require('../db.js');

const drive = Router();

drive.get('/',async (req,res) => {
    const folders = await prisma.folder.findMany({
        where:{
            parentId:req.session.user.rootFolder
        }
    })
    res.render("drive",{folders:folders,route:null});
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
    });
    res.redirect(`/drive`);
});

drive.get('/:folderId',async (req,res) => {
    const selectedFolder = await prisma.folder.findMany({
        where:{
            parentId:req.params.folderId
        }
    })
    res.render("drive",{folders:selectedFolder,route:`${req.params.folderId}`});
});

drive.get('/newFolder/:folderId',async (req,res) => {
    res.render("folders");
});

drive.post('/newFolder/:folderId',async (req,res) => {
    const parentFolder = req.params.folderId;
    const newFolder = await prisma.folder.create({
        data:{
            name:req.body.folderName || 'Untitled Folder',
            parentId:parentFolder
        }
    })
    res.redirect(`/drive/${parentFolder}`);
});


module.exports = drive;