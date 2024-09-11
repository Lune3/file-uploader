const {Router} = require('express');
const prisma = require('../db.js');
const multer  = require('multer');
const cloudinary = require('cloudinary').v2;
const drive = Router();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
  });

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

drive.get('/uploadFile', async (req,res) => {
    res.render("file");
});

drive.post('/uploadFile' ,async(req,res) => {
    const userFile = req.body.userFile;

    const fileSize = req.file.size;
    const fileSizeInKb = (fileSize / 1024).toFixed(2);
    const fileSizeInMb = (fileSize / (1024 * 1024)).toFixed(2);

    const newFile = await prisma.file.create({
        data:{
            name:userFile,
            folderId:req.session.rootFolder,
            size:fileSizeInKb > 1000?fileSizeInMb:fileSizeInKb
        }
    })
    console.log(newFile);
})

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